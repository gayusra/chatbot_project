import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Lottie from 'lottie-react'
import chatbotAnimation from './assets/chatbot_ai.json'
import axios from 'axios'

function App() {

  const ai_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyBeM1XHc1e4s3StI3GFT4ypms7JU1xosEQ"
  const [suggestions, setSuggestions] = useState([

    "What is AI?",
    "What is React.js",
    "what is javascript?",

  ])

  const [messages, setMessages] = useState([])
  
  const [input, setInput] = useState('')

  const handleSubmit = async() =>{
     let usermessage = {sender:"user", text: input}
     setMessages([...messages, usermessage])

     try{
       const response =  await axios.post(ai_url,{
         contents:[{
           parts:[{"text": input}]
         }]
       })

       if(response.data){
        let aimessage = {sender:'AI',text:response.data.candidates[0].content.parts[0].text}
       setMessages(prev => [...prev,aimessage])
       
       }

       setInput('')
       console.log(response.data)
     }catch(err){ 
        let errormessage = {sender:'AI',text:'Sorry, something went wrong! Please try again later.'}
        setMessages(prev => [...prev,errormessage])
     }
  }


  return (
    <>
      <div className='vh-100'>


        <div className='container h-100'>
          <div className='card border-0 shadow-sm bg-transparent h-100' >
            <div className='card-body'>
              <div className='d-flex justify-content-center align-items-center'>
                <div className='my-4'>
                  <Lottie animationData={chatbotAnimation} loop={true} style={{ width: '10rem' }} />
                </div>
              </div>

              <div className='row row-cols-4'>
                {
                  suggestions.map((suggestion, index) => (
                    <div className='col'>
                      <div className='card border-0 shadow-sm suggest-card h-100'>
                        <div className='card-body d-flex justify-content-center align-items-center'>

                          <p className='card-text'>{suggestion}</p>

                        </div>

                      </div>

                    </div>

                  ))
                }
              </div>

               {
                messages.length > 0?
                <>
                 {
                  messages.map((suggestion,index)=>{
                    return(
                     <div className={`${suggestion.sender}-response-message`}>

                     </div>
                    )
                  })
                 }
                </>:null
               }


            </div>
            <div className='card-footer'>
              <div className='input-group'>
                <input type="text" className='form-control' placeholder='Ask me anything' value={input} onChange={(e)=>setInput(e.target.value)}/>
                <button className='btn btn-primary' onClick={handleSubmit}>Send</button>

              </div>

            </div>

          </div>

        </div>
      </div>
    </>
  )
}

export default App
