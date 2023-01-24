import { FastifyInstance } from "fastify"; //é um framework web para Node. js com foco em performance e baixo overhead,
import dayjs from "dayjs"; // é uma pequena biblioteca JavaScript que nos permite parsear, manipular, validar e mostrar datas e horários em navegadores modernos
import { z } from "zod"; //biblioteca para ajudar na validação e tipagem
import { prisma } from "./prisma"; //é uma ferramenta open source, um ORM
import { promise } from "zod/lib";

export async function appRoutes(app: FastifyInstance) {
  //buscando da requisição do front-end duas informaçoes : titulo e dia da semana do habito
  app.post("/habits", async (request) => {
    //validações
    const createHabitBody = z.object({
      title: z.string(), //validando se a variavel title é uma string
      weekDays: z.array(
        z.number().min(0).max(6) //validando se weekDays é um array
      ),
    });

    const { title, weekDays } = createHabitBody.parse(request.body);

    const today = dayjs().startOf("day").toDate();

    await prisma.habit.create({
      data: {
        title,
        created_at: today,
        weekDays: {
          create: weekDays.map((weekDay) => {
            return {
              week_day: weekDay,
            };
          }),
        },
      },
    });
  });

  app.get("/day", async (request) => {
    const getDayParams = z.object({
      date: z.coerce.date(), //transformar a string em data como se fosse um newDate(param)
    });

    const { date } = getDayParams.parse(request.query);

    const parsedDate = dayjs(date).startOf("day");
    const weekDay = parsedDate.get("day");

    //todos os habitos possiveis //habitos que ja foram completados

    //mostrar habitos criados somente ate aquele dia
    const possibleHabits = await prisma.habit.findMany({
      where: {
        created_at: {
          lte: date,
        },
        weekDays: {
          some: {
            week_day: weekDay,
          },
        },
      },
    });

    const day = await prisma.day.findUnique({
      where: {
        date: parsedDate.toDate(), // buscando o dia na tabela de dias do bd onde a data seja igual
      },
      include: {
        dayHabits: true,
      },
    });

    //mostrando o habito completado daquele dia
    const completedHabits = day?.dayHabits.map((dayHabit) => {
      return dayHabit.habit_id;
    }) ?? []


    return {
      possibleHabits,
      completedHabits,
    };
  });

  //completar / nao completar um habito

  app.patch("/habits/:id/toggle", async (request) => {
    //:id é um route parm => parametreo de identificacao

    const toggleHabitParams = z.object({
      id: z.string().uuid(),
    });
    const { id } = toggleHabitParams.parse(request.params);

    const today = dayjs().startOf("day").toDate();
    let day = await prisma.day.findUnique({
      where: {
        date: today,
      },
    });

    if(!day){
        day = await prisma.day.create({
            data:{
                date:today,
            }
        })
    }

    const dayHabit = await prisma.dayHabit.findUnique({
        where: {
            day_id_habit_id:{
                day_id: day.id,
                habit_id: id,
            }
        }
    })
if(dayHabit){
    //remover a marcacao de completo
    await prisma.dayHabit.delete({
        where:{
            id: dayHabit.id,
        }
    })
}
else{
      //completar o habito
    await prisma.dayHabit.create({
        data:{
            day_id: day.id,
            habit_id: id,
        }
    }) 
}
  
 
  });

  app.get('/summary', async ()=>{


    const summary = await prisma.$queryRaw`
    SELECT 
        D.id, 
        D.date,
        (
            SELECT 
                cast(count(*) as float)
            FROM day_habits DH 
            WHERE DH.day_id = D.id
        ) as completed,
        (
            SELECT cast(count(*) as float)
            FROM habit_week_days HWD
            JOIN habits H
                ON H.id = HWD.habit_id
            WHERE
                HWD.week_day = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int)
                AND H.created_at <= D.date
        ) as amount
    FROM days D
    `

    return summary
  })
}
