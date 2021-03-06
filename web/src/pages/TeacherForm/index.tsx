import React, { useState, FormEvent } from 'react'
import PageHeader from '../../components/PageHeader'

import './styles.css'
import Input from '../../components/Input'

import warningIcon from '../../assets/images/icons/warning.svg'
import Textarea from '../../components/Textarea'
import Select from '../../components/Select'
import api from '../../services/api'
import Swal from 'sweetalert2'
import { useHistory } from 'react-router-dom'

function TeacherForm(){
    const history = useHistory()

    const [scheduleItems, setScheduleItems] = useState([
        {
            week_day:0, from: '', to: ''
        }
    ])
    const [name, setName] = useState('')
    const [avatar, setAvatar] = useState('')
    const [whatsapp, setWhatsapp] = useState('')
    const [bio, setBio] = useState('')
    const [subject, setSubject] = useState('')
    const [cost, setCost] = useState('')
    
    function addNewScheduleItem(){
        setScheduleItems([
            ...scheduleItems,
            {
                week_day:0, from: '', to: ''
            }
        ])
    }
    function handleCreateClass(e: FormEvent){
        e.preventDefault()
        api.post('classes', {
            name, 
            avatar, 
            bio, 
            whatsapp, 
            subject,
            cost: Number(cost), 
            schedule: scheduleItems
        }).then(()=>{
            Swal.fire({
                icon: 'success',
                title: 'Parabéns!',
                text:'Cadastro realizado com sucesso!'
            })
            history.push('/')
        }).catch(()=>{
            Swal.fire({
                icon: 'error',
                title: 'Opa!',
                text:'Erro ao realizar o cadastro'
            })
        })
    }
    function setScheduleItemValue(position: Number, field: string, value: string){
        const updatedScheduleItems = scheduleItems.map((scheduleItem, index)=>{
            if(index === position){
                return {...scheduleItem, [field]: value}
            }
            return scheduleItem
        })

        setScheduleItems(updatedScheduleItems)
    }
    return (
        <div id="page-teacher-form" className="container">
            <PageHeader 
                title="Que incrível que você quer dar aulas"
                description="O primeiro passo é preencher o formulário de inscrição"  
            />
            <main>
                <form onSubmit={handleCreateClass}>                
                    <fieldset>
                        <legend>Seus dados</legend>
                        <Input 
                            name="name" 
                            label="Nome completo" 
                            type="text"
                            value={name}
                            onChange={(e) =>{
                                setName(e.target.value)
                            }}
                        />
                        <Input 
                            name="avatar" 
                            label="Avatar" 
                            type="text"
                            value={avatar}
                            onChange={(e) =>{
                                setAvatar(e.target.value)
                            }}
                        />
                        <Input 
                            name="whatsapp" 
                            label="Whatsapp" 
                            type="text"
                            value={whatsapp}
                            onChange={(e) =>{
                                setWhatsapp(e.target.value)
                            }}
                        />button
                        <Textarea 
                            name="bio" 
                            label="bio"
                            value={bio}
                            onChange={(e) =>{
                                setBio(e.target.value)
                            }}
                        />
                    </fieldset>
                    <fieldset>
                        <legend>Sobre a aula</legend>
                        <Select 
                            name="subject" 
                            label="Matéria" 
                            value={subject}
                            onChange={(e)=>{
                                setSubject(e.target.value)
                            }}
                            options={[
                                {
                                    value:'Artes',
                                    label:'Artes'
                                }
                            ]}
                        />
                        <Input 
                            name="cost" 
                            label="Custo da sua hora por aula" 
                            type="text"
                            value={cost}
                            onChange={(e)=>{setCost(e.target.value)}}
                        />
                                        
                    </fieldset>
                    <fieldset>
                        <legend>Horários disponíveis

                            <button type="button" onClick={addNewScheduleItem}>
                                + Novo horário
                            </button>
                        </legend>

                        {
                            scheduleItems.map((scheduleItem, index) =>{
                                return (
                                    <div key={scheduleItem.week_day} className="schedule-item">
                                        <Select 
                                            name="week-day" 
                                            label="Dia da semana" 
                                            value={scheduleItem.week_day}
                                            options={[
                                                {
                                                    value:'0',
                                                    label:'Domingio'
                                                },
                                                {
                                                    value:'1',
                                                    label:'Segunda'
                                                },
                                                {
                                                    value:'2',
                                                    label:'Terça'
                                                },
                                                {
                                                    value:'3',
                                                    label:'Quarta'
                                                },
                                                {
                                                    value:'4',
                                                    label:'Quinta'
                                                },
                                                {
                                                    value:'5',
                                                    label:'Sexta'
                                                },
                                                {
                                                    value:'6',
                                                    label:'Sábado'
                                                },
                                            ]}
                                            onChange={e => setScheduleItemValue(index, 'week_day', e.target.value)}
                                        />
                                        <Input 
                                            name="from" 
                                            label="Das" 
                                            type="time"
                                            value={scheduleItem.from}
                                            onChange={e => setScheduleItemValue(index, 'from', e.target.value)} 
                                        />
                                        <Input 
                                            name="to" 
                                            label="Até" 
                                            type="time"
                                            value={scheduleItem.to}
                                            onChange={e => setScheduleItemValue(index, 'to', e.target.value)} 
                                        />
                                    </div>
                                ) 

                            })
                        }
                        
                    </fieldset>

                    <footer>
                        <p>
                            <img src={warningIcon} alt="Aviso importante"/>
                            Importante! <br />
                            Preencha todos os dados
                        </p>
                        <button type="submit">
                            Salvar cadastro
                        </button>
                    </footer>
                </form>
            </main>
        </div>
    )
}
export default TeacherForm