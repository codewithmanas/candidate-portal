
import { getStudentDataById } from '@/utils/getStudentDataById';
import React from 'react'

const CandidatePage = async ({params}: { params: Promise<{params: string}>}) => {

    const { id } = await params;

    const data = await getStudentDataById(id);



    // console.log("data: ", data);
    
  return (
    <div>CandidatePage: {id}
        <h1>URL: {data.resume_url}</h1>
    </div>
  )
}

export default CandidatePage