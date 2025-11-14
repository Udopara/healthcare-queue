import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import ReactMarkdown from 'react-markdown'
import axios from 'axios'
import { mediQueueAi } from './HuggingFace'

export default function AskAI() {

  const [messages, setMessages] = useState([])
  const [userInput, setUserInput] = useState("")

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!userInput.trim()) return;

    const user = { role:'user', content:userInput }
    setMessages((prev) => [...prev, user])
    setUserInput("")

    try {

      const huggingFaceReply = await mediQueueAi(userInput)
      setMessages((prev) => [...prev, { role:'bot', content:huggingFaceReply }])

    } catch (error) {
      setMessages((prev) => [...prev, { role:'bot', content:"😔 Sorry, MediQueueAI is having troubles giving you a reply at the moment" }])
    }
  }

  return (
    <DashboardLayout>

      <div className="flex flex-col items-center justify-center space-y-8">

        <div className="w-[95%] bg-white rounded-2xl flex flex-col h-[80vh]">
          <div className="flex-1 overflow-y-auto p-4 space-y-10">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`whitespace-pre-line ${
                  message.role === "user"
                    ? "bg-indigo-200 rounded-tl-3xl rounded-bl-2xl text-black shadow-md self-end ml-auto w-fit px-4 py-2"
                    : "bg-indigo-100 rounded-tr-3xl rounded-br-2xl text-black shadow-md self-start mr-auto max-w-[60%] px-4 py-2  "
                }`}
              >
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            ))}
          </div>

          <form onSubmit={sendMessage}
            className="border-t border-gray-200 py-3 px-4 flex items-center justify-center bg-white rounded-b-2xl">
            <div className="flex items-center justify-center w-full gap-3">
              <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Ask MediQueue..."
                className="w-[65%] border border-indigo-500 h-12 rounded-full px-4 py-2 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"/>
              <button type="submit" className="bg-indigo-600 text-white px-5 py-2 rounded-full font-medium hover:bg-indigo-700 transition">Send</button>
            </div>
          </form>
        </div>
      </div>


    </DashboardLayout>
  )
}

