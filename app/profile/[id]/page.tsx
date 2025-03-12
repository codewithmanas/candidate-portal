
// import CandidateEvaluation from '@/components/CandidateEvaluation';
// import { getStudentDataById } from '@/utils/getStudentDataById';
import React from 'react'

const CandidatePage = async ({params}: { params: Promise<{id: string}>}) => {

    const { id } = await params;

    // const data = await getStudentDataById(id);



    // console.log("data: ", data);
    
  return (
    <div>
        {/* <CandidateEvaluation id={id} /> */}
        <h1>Id: {id}</h1>
    </div>
  )
}

export default CandidatePage