import React from 'react'


const Prosettings = () => {
    return (
        <div>
            <h1 className='text-3xl font-bold'>Settings</h1>
            <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                    <label htmlFor="name" className='text-lg font-semibold'>Name</label>
                    <input type="text" id="name" className='border border-gray-300 rounded p-2' placeholder='Enter your name' />
                </div>
                <div className='flex flex-col gap-2'>
                    <label htmlFor="email" className='text-lg font-semibold'>Email</label>
                    <input type="email" id="email" className='border border-gray-300 rounded p-2' placeholder='Enter your email' />
                </div>
                <div className='flex flex-col gap-2'>
                    <label htmlFor="password" className='text-lg font-semibold'>Password</label>
                    <input type="password" id="password" className='border border-gray-300 rounded p-2' placeholder='Enter your password' />
                </div>
                <button className='bg-blue-500 text-white rounded p-2 hover:bg-blue-600'>Save Changes</button>
            </div>
        </div>
    )
}
export default Prosettings 
