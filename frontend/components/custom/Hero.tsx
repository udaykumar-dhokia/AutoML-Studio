import { Safari } from '../ui/safari'
import { Highlighter } from '../ui/highlighter'
import { Button } from '../ui/button'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

const Hero = () => {
    return (
        <div className='flex flex-col justify-center items-center min-h-screen mt-10'>
            <p className='text-xl'><i>Build your <Highlighter action="underline" color="#FF9800">first model</Highlighter> in <Highlighter action="strike-through" color="#1d1d1d">hours</Highlighter> minutes with </i></p>
            <h1 className='text-6xl font-bold my-2'>AutoML Studio</h1>
            <p className='text-md text-center max-w-xl'>A visual, workflow-based platform that enables you to design, train, and evaluate machine learning models using intuitive node-based pipelines.</p>
            <div className="my-4 flex gap-2">
                <Link href={"/register"}>
                    <Button>Train your first model <ArrowUpRight /></Button>
                </Link>
                <Button variant="outline">Watch Demo</Button>
            </div>
            <div className="w-[700px] shadow-lg mt-10">
                <Safari
                    url="automl-studio.com"
                    imageSrc="https://camo.githubusercontent.com/efb1a702a0f30b51926dfa249b2f1660a30d5163d73632367a2ff1f4ac32a4f5/68747470733a2f2f64726976652e676f6f676c652e636f6d2f75633f6578706f72743d766965772669643d31453033626869382d796945347a4368374774347374575f74374a3379324a3174"
                />
            </div>
        </div>
    )
}

export default Hero