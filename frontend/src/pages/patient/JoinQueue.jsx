import React from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useState } from 'react'
import jsPDF from 'jspdf/dist/jspdf.umd.min.js'
import { format } from 'date-fns'

export default function JoinQueue() {

  const [queueDetails, setQueueDetails] = useState({})
  const [ticket, setTicket] = useState("")
  const [popUp, setPopUp] = useState(false)

 const getQueueIdFromDepartment = (department) => { 
  const map = { 
    Cardiology: 1,
    Dermatology: 2,
    Neurology: 3,
    Onocology: 4,
    Pediatrics: 5 
  }; 
  return map[department] || 1; };

  const submitData = async (e) => {
    e.preventDefault()
    const queueData = new FormData(e.target)
    const queueDataObj = Object.fromEntries(queueData.entries())

    //const queue_id = getQueueIdFromDepartment(queueDataObj.department);
    setQueueDetails(queueDataObj)

    try {
      // Call the backend API
      const response = await fetch("http://localhost:3000/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          queue_id: getQueueIdFromDepartment(queueDataObj.department),
          notification_contact: queueDataObj.phone
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Error creating ticket");
        return;
      }

      // Save ticket info for preview and download
      setTicket(data.ticket);
      setPopUp(true);
    } catch (error) {
      console.error("Error creating ticket:", error);
      alert("Failed to create ticket. Check console.");
    }

    e.target.reset();
  }
  
  const downloadTicketPDF = () => {
    if (!ticket) return;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [92, 120] // small ticket size
    });

    // Draw border around the ticket
    doc.setDrawColor(0); // black border
    doc.setLineWidth(0.5);
    doc.rect(2, 2, 88, 116); // x, y, width, height

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(16);
    doc.text("MediQueue Healthcare", 40, 12, { align: "center" });

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(13);
    doc.text("Ticket Preview", 40, 20, { align: "center" });

    // Dotted separator
    const drawDottedLine = (y) => {
      doc.setLineWidth(0.2);
      doc.setDrawColor(100);
      for (let x = 10; x < 70; x += 2) {
        doc.line(x, y, x + 1, y);
      }
    };

    let y = 35; // starting vertical position for fields
    const lineSpacing = 13;

    const drawField = (label, value) => {
      doc.setFont("Helvetica", "bold");
      doc.text(`${label}:`, 10, y);
      doc.setFont("Helvetica", "normal");
      doc.text(value, 35, y);
      y += lineSpacing;
      drawDottedLine(y -10); // add dotted line after each field
    };

    drawField("Name", `${queueDetails.firstname} ${queueDetails.lastname}`);
    drawField("Dept.", queueDetails.department || "-");
    drawField("Service", queueDetails.visit);
    drawField("Ticket ID", ticket.id || "-");
    drawField("Issued at", ticket.issued_at ? new Date(ticket.issued_at).toLocaleString() : "-");
    drawField("Status", ticket.status || "-");

    doc.save(`MediQueue-Ticket.pdf`);
  };


  return (
    <DashboardLayout>

      <div className='flex flex-col lg:flex-row gap-8'>

        <div className='flex-1 p-5 rounded-2xl shadow-xl border border-gray-300 border-l-indigo-600'>

          <form onSubmit={submitData} className='space-y-3'>
            <h2 className=' text-xl font-medium mb-5'>Personal Details</h2>
            <div className='space-y-5'>
              <div>
                <label htmlFor='firstname' className='text-slate-500'>First Name</label>
                <input required type="text" autoComplete='name' name='firstname' className='bg-indigo-50 border rounded-2xl border-slate-300 lg:w-80 md:w-80 sm:w-64 h-7 pl-4 ml-4 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 focus:border-0 placeholder-slate-400' />
              </div>
              <div>
                <label htmlFor='lastname' className='text-slate-500'>Last Name</label>
                <input required type="text" name='lastname' className='bg-indigo-50 border rounded-2xl border-slate-300 lg:w-80 md:w-80 sm:w-64 h-7 pl-4 ml-4 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 focus:border-0 placeholder-slate-400' />
              </div>
            </div>

            <h2 className='text-xl font-medium mt-10 mb-5'>Contact info</h2>
            <div className='lg:flex justify-between'>
              <div>
                <label htmlFor='email' className='text-slate-500'>Email</label>
                <input required type="email" autoComplete='name' name='email' className='bg-indigo-50 border rounded-2xl border-slate-300 lg:w-60 md:w-80 sm:w-64 h-7 pl-4 ml-2 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 focus:border-0 placeholder-slate-400' />
              </div>
              <div>
                <label htmlFor='phone' className='text-slate-500'>Phone</label>
                <input required type="tel" inputMode='numeric' pattern="[0-9]*" autoComplete='name' name='phone' className='bg-indigo-50 border rounded-2xl border-slate-300 lg:w-60 md:w-80 sm:w-64 h-7 pl-4 ml-2 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 focus:border-0 placeholder-slate-400' />
              </div>
            </div>

            <h2 className='text-xl font-medium mt-10 mb-5'>Queue Details</h2>
            <div className='space-y-5'>
              <div>
                <label htmlFor='department' className='text-slate-500'>Choose a Department</label>
                <select name="department" defaultValue="" required className='ml-5 ring ring-slate-300 w-36 p-1 rounded-2xl hover:cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-600'>
                  <option value='' className='text-slate-400' disabled>--- Select ---</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Onocology">Onocology</option>
                  <option value="Pediatrics">Pediatrics</option>
                </select>
              </div>

              <div>
                <label htmlFor='visit' className='text-slate-500'>Reason for visit</label>
                <input type="text" name='visit' className='bg-indigo-50 border rounded-2xl border-slate-300 lg:w-80 md:w-80 sm:w-64 h-7 pl-4 ml-5 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 focus:border-0 placeholder-slate-400' />
              </div>

              <div>
                <label htmlFor='visit' className='text-slate-500'>Prefered Day</label>
                <input type="datetime-local" placeholder="Select a Day" name="preferredDay"  className='bg-indigo-50 border rounded-2xl border-slate-300 lg:w-60 md:w-60 sm:w-60 h-7 pl-4 ml-5 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 focus:border-0 placeholder-slate-400' />
              </div>
            </div>
            <div className='flex items-center justify-center mt-10'>
              <input type='submit' className='text-white bg-indigo-600 w-24 h-8 rounded-xl hover:cursor-pointer ring hover:ring-indigo-600 hover:text-indigo-600 hover:bg-white' />
            </div>
          </form>

        </div>

        {popUp && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className='flex flex-col items-center justify-center bg-white rounded-4xl border border-gray-300 space-y-10 h-52 w-96'>
              <h2 className='text-2xl font-light'>Ticket Created Successfully! ✅</h2>
              <div>
                <button onClick={() => setPopUp(false)} className='text-white bg-red-600 w-24 h-8 rounded-xl hover:cursor-pointer ring hover:ring-red-600 hover:text-red-600 hover:bg-white'>Close</button>
              </div>
            </div>
          </div>
        )}

        <aside className='lg:w-1/3 w-full h-auto lg:h-96 sticky top-10 self-start p-5 border border-gray-300 border-l border-l-indigo-600 rounded-2xl shadow-xl space-y-6'>

          <h1 className='text-center font-medium'>Ticket Preview</h1>

          <div className='flex flex-col justify-between h-72'>
            <div className='space-y-3'>
              <p className='text-slate-600'>Name: <span className='ml-2 text-black'>{queueDetails.firstname} {queueDetails.lastname}</span></p>
              <p className='text-slate-600'>Department: <span className='ml-2 text-black'>{queueDetails.department  || "-"}</span></p>
              <p className='text-slate-600'>Service Type: <span className='ml-2 text-black'>{queueDetails.visit || "-"}</span></p>
              <p className='text-slate-600'>Ticket ID: <span className='ml-2 text-black'>{ticket.id || "-"}</span></p>
              <p className='text-slate-600'>Status: <span className='ml-2 text-black'>{ticket.status || "-"}</span></p>
              <p className='text-slate-600'>Issued at: <span className='ml-2 text-black'>{ticket.issued_at ? new Date(ticket.issued_at).toLocaleString() : "-"}</span></p>
            </div>
            <div className='flex items-center justify-center'>
              <button onClick={downloadTicketPDF} className='text-white bg-indigo-600 w-36 h-8 rounded-xl hover:cursor-pointer ring hover:ring-indigo-600 hover:text-indigo-600 hover:bg-white'>Download Ticket</button>
            </div>
          </div>

        </aside>
      </div>

    </DashboardLayout>
  )
}

