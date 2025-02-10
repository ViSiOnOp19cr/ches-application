
// import {Chess} from './assets/chess';
import chessboard from './chessbaord.webp'

export const Landing = ()=>{
    return (
        <div className='flex justify-center'>
            <div className='mt-2'> 
                <div className='grid grid-cols1 gap-4 md:grid-cols-2'>
                    <div className='flex justify-center p-8'>
                        <img className="max-w-96" src={chessboard} alt="chess board"/>
                    </div>
                    <div>
                        <h1 className='text-2xl font-bold text-white'>Welcome to Chess</h1>
                        <p className='mt-2 font-bold text-white'>India's #2 chess site</p>
                        <p className='mt-2 text-white'>To play, click on the link below</p>
                        <div className='m-12'><button className='px-12 py-4 text-2xl bg-blue-500 hover:bg-blue-700 text-white font-bold rounded'>Play</button></div>
                    </div>
                </div>
            </div>
        </div>
    )
}