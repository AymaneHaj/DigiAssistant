import React, { useEffect, useState, useContext } from 'react'
import api from '../api/axiosClient'
import ChatMessage from '../components/ChatMessage'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Diagnostic(){
  const [conversationId, setConversationId] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [messages, setMessages] = useState([])
  const [userAnswer, setUserAnswer] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isFinished, setIsFinished] = useState(false)
  const { token } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(()=>{
    if (!token) return
    startConversation()
    // eslint-disable-next-line
  }, [token])

  const startConversation = async ()=>{
    setIsLoading(true)
    setError(null)
    try{
      const res = await api.post('/api/v1/chat', { conversation_id: null, user_answer: null })
      const d = res.data
      setConversationId(d.conversation_id)
      setCurrentQuestion(d.ai_question || 'Hello!')
      setMessages([{ from: 'ai', text: d.ai_question || 'Hello!' }])
    }catch(err){
      setError(err?.response?.data?.message || 'Could not start conversation')
    }finally{ setIsLoading(false) }
  }

  const submitAnswer = async ()=>{
    if (!userAnswer) return
    setIsLoading(true)
    setError(null)
    setMessages(prev => [...prev, { from: 'user', text: userAnswer }])
    try{
      const res = await api.post('/api/v1/chat', { conversation_id: conversationId, user_answer: userAnswer })
      const d = res.data
      const aiQ = d.ai_question || ''
      setMessages(prev => [...prev, { from: 'ai', text: aiQ }])
      setCurrentQuestion(aiQ)
      setUserAnswer('')
      if (d.current_criterion_id === 'FINISHED'){
        setIsFinished(true)
        // navigate to results page with conversation id
        navigate(`/results?conversation_id=${d.conversation_id}`)
      }
    }catch(err){
      setError(err?.response?.data?.message || 'Failed to send answer')
    }finally{ setIsLoading(false) }
  }

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h2 className="text-2xl font-semibold">Diagnostic</h2>
      <div className="mt-4 bg-white rounded shadow p-4 h-[60vh] overflow-auto" id="chat-area">
        {messages.length===0 && <div className="text-gray-500">No messages yet.</div>}
        {messages.map((m,i)=> <ChatMessage key={i} from={m.from} text={m.text} />)}
      </div>

      <div className="mt-4">
        {error && <div className="text-red-600">{error}</div>}
        <textarea value={userAnswer} onChange={e=>setUserAnswer(e.target.value)} className="w-full border rounded p-2" rows={4} placeholder="Type your answer..." />
        <div className="flex items-center justify-between mt-2">
          <div>{isLoading ? <span className="text-sm text-gray-500">Loading...</span> : null}</div>
          <div className="space-x-2">
            <button onClick={()=>setUserAnswer('')} className="px-3 py-1 border rounded">Clear</button>
            <button onClick={submitAnswer} disabled={isLoading} className="px-4 py-2 bg-sky-600 text-white rounded">Send</button>
          </div>
        </div>
      </div>
    </div>
  )
}

