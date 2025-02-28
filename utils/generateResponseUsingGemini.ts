import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);


export async function generateResponseUsingGemini(contextText: string, queryText: string, candidateData: { extracted_text: string }) {
    // const model = genAI.getGenerativeModel({ model: "text-davinci-003" });


    // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-002" });


    // const format = {
    //     scores: {
    //         overall: 80,
    //         technical: 50,
    //         experience: 60,
    //         communication: 50,
    //         jobFit: 90,
    //       },
    //       extractSections :  {
    //         summary: "",
    //         skillAssessment: "",
    //         experienceEvaluation: "",
    //         recommendations: ""    
    //     }
    // }

      // Construct prompt with retrieved context
    //   Use the following context to answer the user's question in 20 words or less.:
    // Context:
    // ${contextText}

    // User Question: ${queryText}
    // Answer:

            // Use the following context to answer the user's question:
        // const prompt = `


        //       Analyze the following candidate profile and provide:
        //         1. A summary of their key qualifications
        //         2. Skill assessment
        //         3. Experience evaluation
        //         4. Recommendations for improvement

        //       Profile:
        //         Name: ${candidateData.name}
        //         Skills: ${candidateData.skill}
        //         Experience: ${candidateData.experience}
        //         Resume Text: ${candidateData.extracted_text}

        // Generate me a simple object in the given format:  ${format}


        // `;

    // const prompt = `Hi`;
    // please follow this given format:

    const prompt = `
    Analyze the following candidate profile and provide:
    1. Candidate overall score (0-100)
    2. Technical score (0-100)
    3. Experience score (0-100)
    4. Communication score (0-100)
    5. JobFit score (0-100)
    6. Summary
    7. Skill Assessment
    8. Experience Evaluation
    9. Recommendations


    please provide a javascript object in the following exact format:

        {
            scores: {
                overall: 80,
                technical: 50,
                experience: 60,
                communication: 50,
                jobFit: 90,
            },
            extractSections :  {
                summary: "",
                skillAssessment: "",
                experienceEvaluation: "",
                recommendations: ""    
            }
    }

    Profile:
    ${candidateData.extracted_text} and ${contextText}
    `;

    const result = await model.generateContent({
      contents: [{
        role: "user",
        parts: [
          { text: `${prompt}` }
        ],
      }],
    });

    return result;
  }



// const data = {
//     scores: {
//         overall: 80,
//         technical: 50,
//         experience: 60,
//         communication: 50,
//         jobFit: 90,
//       },
//       extractSections :  {
//         summary: "",
//         skillAssessment: "",
//         experienceEvaluation: "",
//         recommendations: ""    
//     }
// }