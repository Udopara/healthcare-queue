import React from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useState } from 'react'

export default function JoinQueue() {

  const [queueDetails, setQueueDetails] = useState({})
  const [ticket, setTicket] = useState("")

  const submitData = (e) => {
    const queueData = new FormData(e.target)
    const queueDataObj = Object.fromEntries(queueData.entries())

    setQueueDetails(queueDataObj)
  }

  return (
    <DashboardLayout>
      
      <div className='flex gap-8'>
        <div className='flex-1 h-80 p-5 rounded-2xl shadow-xl'>
          <h1>Join Queue</h1>

          <form onSubmit={submitData}></form>
        </div>

        <aside className='w-1/4 h-96 sticky top-10 self-start p-5 border-l border-l-indigo-600 rounded-2xl shadow-xl'>
          <h1 className='text-center font-medium'>Ticket Preview</h1>
        </aside>
      </div>

    </DashboardLayout>
  )
}

