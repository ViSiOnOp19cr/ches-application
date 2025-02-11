

import { useNavigate } from 'react-router-dom'
import chessboard from '../assets/chessbaord.webp'
import { Button } from '../ui/button'

export const Landing = ()=>{
    const navigate  = useNavigate()
    const handlePlay = ()=>{
        navigate('./game');
    }
    return (
        <div className='flex justify-center'>
            <div className='pt-8 max-w-screen-ld'> 
                <div className='grid grid-cols1 gap-4 md:grid-cols-2'>
                    <div className='flex justify-center p-8'>
                        <img className="max-w-96" src={chessboard} alt="chess board"/>
                    </div>
                    <div className='pt-16'>
                        <h1 className='text-2xl font-bold text-white'>Welcome to Chess India's #2 chess site</h1>

                        <p className='mt-2 text-white'>To play, click on the link below</p>
                        <div className='px-12 py-4 '><Button varient = 'secondary' onClick={handlePlay} text="Play" size="lg" /></div>
                    </div>
                </div>
            </div>
        </div>
    )
}