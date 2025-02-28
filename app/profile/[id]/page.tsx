
import CandidateEvaluation from '@/components/CandidateEvaluation';
// import { getStudentDataById } from '@/utils/getStudentDataById';
import React from 'react'

const CandidatePage = async ({params}: { params: Promise<{params: string}>}) => {

    const { id } = await params;

    // const data = await getStudentDataById(id);



    // console.log("data: ", data);
    
  return (
    <div>
        <CandidateEvaluation id={id} />
    </div>
  )
}

export default CandidatePage