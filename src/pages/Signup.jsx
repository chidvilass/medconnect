import React, { useState } from 'react'
import signupImg from '../assets/images/signup.gif'
import { Link, useNavigate } from 'react-router-dom'
import uploadToCloudinary from '../utils/uploadToCloudinary.js'
import { toast } from 'react-toastify'
import HashLoader from 'react-spinners/HashLoader.js'

const Signup = () => {

  const [selectedFile,setSelectedFile] = useState(null)
  const [previewURL,setPreviewURL] =useState("")
  const [loading,setLoading] = useState(false)
 
  const navigate = useNavigate()

  const [formData,setFormData] = useState({
    name:'',
    email:'',
    password:'',
    photo:selectedFile,
    gender:'male',
    role:'patient'

  })

  const handleChange = (e) =>{
    setFormData({...formData, [e.target.name]:e.target.value})
    
  }

  const handleFileInput = async(e)=>{
    const file = e.target.files[0]
    
    const data = await uploadToCloudinary(file);

    if(!data)
      {
        console.error("Error in uploading in cloudinary")
        return
      }
console.log(data)
    setPreviewURL(data.url)
    setSelectedFile(data.url)
    setFormData({...formData,photo:data.url})

  }

  const submitHandler = async(e)=>{

    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/v1/auth/register',{
        method:'post',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(formData)
      })
  
      const {message} = await res.json();
  
      if(!res.ok){
        throw new Error(message);
      }
  
      toast.success(message)
      navigate('/login')
    } catch (error) {
      
      toast.error(error.message)

    }finally{
      setLoading(false)
    }


  }

  

  return <section className="px-5" >
    <div className="max-w-[1170px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="hidden lg:block bg-primaryColor rounded-l-lg">
          <figure className="rounded-l-lg">
            <img src={signupImg} alt="" className="w-full rounded-l-lg" />
          </figure>
        </div>

        <div className="rounded-l-lg lg:pl-16 py-10">
          <h3 className="text-heading Color text-[22px] leading-9 font-bold mb-10">Create an <span className="text-primaryColor">Account</span></h3>

          <form onSubmit={submitHandler}>
          <div className=' mb-5'>
            <input type="text" placeholder='Enter your Full Name'  
            name='name' 
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
            required
            />
          </div>
          <div className=' mb-5'>
            <input type="email"
             placeholder='Enter your Email' 
             value={formData.email}
            onChange={handleChange}
            name='email' 
            className="w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
            required
            />
            </div>
          <div className=' mb-5'>
            <input type="password"
             placeholder='Password' 
             value={formData.password}
            onChange={handleChange}
            name='password' 
            className="w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
            required
            />
          </div>


          <div className="mb-5 flex items-center justify-between gap-3">
            <label className="text-heading Color font-bold text-[16px] leading-7">
              Are you a:
              <select name="role" 
              value={formData.role}
              onChange={handleChange}
              className="text-textColor font-semibold text-[15px] leading-7 px-4 py-3
focus:outline-none">
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
            </label>
            <label className="text-headingColor font-bold text-[16px] leading-7">
              Gender:
              <select name="gender" 
              value={formData.gender}
              onChange={handleChange}
              className="text-textColor font-semibold text-[15px] leading-7 px-4 py-3
focus:outline-none">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="others">Others</option>
              </select>
            </label>
          </div>

          <div className=' mb-5 flex items-center gap-3'>
           { selectedFile && ( <figure className=' w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center '>
              <img src={previewURL} alt=""  className=' w-full rounded-full' />
            </figure>) }

            <div className=' relative w-[130px] h-[50px] '>
              <input type="file"  
              name='photo' 
              id='customFile' 
              onChange={handleFileInput}
              accept='.jpg, .png' 
              className=' absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer '
              />

              <label htmlFor="customFile" className=' absolute top-0 left-0 w-full h-full  flex items-center px-[0.75rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer  '>Upload Photo</label>

            </div>
          </div>

          <div className=' mt-7'>
            <button type='submit'
            disabled={loading && true}
            
            className='w-full
             bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3 ' >{loading ?<HashLoader size={35}color='#ffffff'  /> :'Sign Up'}</button>
          </div>

          <p className=' mt-5 text-center text-textColor'> Already have an account?. <Link to='/login' className=' text-primaryColor font-medium ml-1 '>Sign-In</Link></p>

          </form>
        </div>

      </div>
    </div>
  </section>
}

export default Signup