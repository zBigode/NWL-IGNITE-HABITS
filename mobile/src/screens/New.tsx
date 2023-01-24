import { ScrollView, View , Text, TextInput,TouchableOpacity, Alert} from "react-native";
import { BackButton } from "../components/BackButton";
import { Checkbox } from "../components/Checkbox";
import {Feather} from '@expo/vector-icons'
import colors from "tailwindcss/colors";
import { useState } from "react";
import { api } from "../lib/axios";

const avaiableWeekDays = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sabado']


export function New(){
    const [weekDays,setweekDays] = useState<number[]>([])
    const [title, setTitle] = useState('')


    function handleToggleWeekDay(weekDayIndex:number){
        if(weekDays.includes(weekDayIndex)){
            setweekDays(prevState => prevState.filter(weekDay => weekDay !==weekDayIndex))
        }else{
            setweekDays(prevState => [...prevState,weekDayIndex])
        }
    }

async function handleCreateNewHabit() {
    try {
        if(!title.trim() || weekDays.length === 0 ){
           return  Alert.alert('Novo Habito', 'informe o nome do habito e selecione a periodicidade.')

        }
        await api.post('/habits', { title , weekDays })
        setTitle('')
        setweekDays([])
        Alert.alert('Novo Habito', 'Novo habito criado com sucesso')
    } catch (error) {
        console.log(error)
        Alert.alert('ops','Nao foi possivel criar um novo habito')
    }
}

return(
    <View className="flex-1 bg-background px-8 pt-16">
<ScrollView 
contentContainerStyle={{paddingBottom:40}}
showsVerticalScrollIndicator={false}
>
<BackButton />

<Text className="mt-6 text-white font-extrabold text-3xl">
Criar hábito
</Text>
<Text className="mt-6 mb-3 text-white font-semibold text-base">
Qual seu comprometimento?
</Text>

<TextInput 
className="pl-4 rounded-lg bg-zinc-900 text-white h-12 border-2 border-zinc-800 focus:border-green-600"
placeholder="Exercicios, dormir..."
placeholderTextColor={colors.zinc[400]}
onChangeText={setTitle}
value={title} //title
/>

<Text className="font-semibold mt-4 mb-3 text-white text-base">
    Qual a reccorencia
</Text>
{
    avaiableWeekDays.map((weekDay,index) =>
    <Checkbox 
    onPress={()=> handleToggleWeekDay(index)}
    key={weekDay}
    title={weekDay}
    checked={weekDays.includes(index)}
    />
    )
}


<TouchableOpacity
activeOpacity={0.7}
onPress={handleCreateNewHabit}
className="w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6">
<Feather 
name="check"
size={20}
color={colors.white}
/>

<Text className="font-semibold text-base text-white ml-2">
Confirmar
</Text>
</TouchableOpacity>

</ScrollView>
    </View>
)
}