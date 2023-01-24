import { generateDatesFromYearBeginning } from "../utils/generate-dates-from-year-beginning";
import { HabitDay } from "./HabitDay";
import { useState, useEffect } from "react";
import { api } from "../lib/axios";
import dayjs from "dayjs";

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

const sumaryDates = generateDatesFromYearBeginning();


const minSumaryDatesSize = 18 * 7; //18 semas 7 dias
const amountOfDaystoFill = minSumaryDatesSize - sumaryDates.length;

type Summary = {
  id: string;
  date: string;
  amount: number;
  completed: number;
}[]

export function SummaryTable() {
  const [summary, setSummary] = useState<Summary>([]);

  useEffect(() => {
    api.get('summary').then(response => {
      setSummary(response.data)
    })
  }, [])

  return (
    <div className="w-full flex ">
      <div className="grid-rows-7 grid grid-flow-row gap-3">
        {weekDays.map((weekDays, i) => {
          return (
            <div
              key={`${weekDays}-${i}`}
              className="text-zinc-400 font-bold text-xl w-10 h-10 flex items-center justify-center"
            >
              {weekDays}
            </div>
          );
        })}
      </div>

      <div className="grid grid-rows-7 grid-flow-col gap-3 ">
        {summary.length > 0 && sumaryDates.map(date => {
          const dayInSummary = summary.find(day => {
            return dayjs(date).isSame(day.date, 'day');
          });

          return (
            <HabitDay
              key={date.toString()}
              date={date}
              amount={dayInSummary?.amount}
              defaultCompleted={dayInSummary?.completed}
            />
          );
        })}

        {amountOfDaystoFill > 0 &&
          Array.from({ length: amountOfDaystoFill }).map((_, i) => {
            return (
              <div
                key={i}
                className=" border-zinc-800 rounded-lg w-10 h-10 bg-zinc-900 border-2 opacity-40 cursor-not-allowed"
              ></div>
            );
          })}
      </div>
    </div>
  );
}
