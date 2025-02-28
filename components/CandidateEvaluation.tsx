"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Award, CheckCircle2, FileText, Lightbulb, Star } from 'lucide-react';
import LoadingEvaluation from './LoadingEvaluation';

// interface CandidateEvaluationProps {
//   data: {
//     analysis: string;
//     success: boolean;
//   };
// }

export default function CandidateEvaluation({ id }) {
  const [activeTab, setActiveTab] = useState('summary');
  const [studentData, setStudentData] = useState(null);
  
  // Parse the analysis text to extract different sections
  // const analysisText = null;
  // const analysisText = data.analysis || '';
  const analysisText = '';

  const getStudentDataById = async () => {
    const response = await fetch(`/api/query/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "queryText": "give me the response"
        }),
    });

    const data = await response.json();

    // console.log("data: ", JSON.parse(data.data.response));
    // console.log("data: ", JSON.parse(data.data.response.replace(/^```json\s*|\s*```$/g, '')));
    const actualData = JSON.parse(data.data.response.replace(/^```json\s*|\s*```$/g, ''));

    setStudentData(actualData);
  }

  useEffect(() => {
    getStudentDataById();
  }, []);

  // console.log("studentData: ", studentData);

  if(!studentData) {
    return (
      <>
        <LoadingEvaluation />
      </>
    )
  }
  
  // Extract sections from the analysis text
  const extractSection = (text: string, sectionTitle: string): string => {
    const regex = new RegExp(`${sectionTitle}[:\\s]*(.*?)(?=\\d+\\.|$)`, 's');
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  };

  // Generate scores based on the analysis
  const generateScores = () => {
    // This would normally be calculated by the AI, but we're simulating it here
    return {
      overall: Math.floor(Math.random() * 30) + 70, // 70-99
      technical: Math.floor(Math.random() * 30) + 70,
      experience: Math.floor(Math.random() * 30) + 70,
      communication: Math.floor(Math.random() * 30) + 70,
      jobFit: Math.floor(Math.random() * 30) + 70,
    };
  };

  const scores = generateScores();
  
  // Extract sections
  const summary = extractSection(analysisText, '1\\. A summary of their key qualifications') || 
    "The candidate has a strong background in software development with experience in multiple programming languages and frameworks. They have demonstrated skills in problem-solving and team collaboration.";
  
  const skillAssessment = extractSection(analysisText, '2\\. Skill assessment') || 
    "The candidate possesses strong technical skills in JavaScript, React, and Node.js. They have experience with database technologies and cloud platforms. Their problem-solving abilities and attention to detail are notable strengths.";
  
  const experienceEvaluation = extractSection(analysisText, '3\\. Experience evaluation') || 
    "The candidate has relevant industry experience working on similar projects. They have demonstrated the ability to work in team environments and deliver results. Their experience aligns well with the requirements of the position.";
  
  const recommendations = extractSection(analysisText, '4\\. Recommendations for improvement') || 
    "The candidate could benefit from expanding their knowledge in cloud technologies and microservices architecture. Additional certifications in relevant technologies would strengthen their profile. Developing more experience with agile methodologies would also be beneficial.";

  // Format score label
  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Average';
    return 'Needs Improvement';
  };

  // Get color class based on score
  const getScoreColorClass = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 80) return 'text-blue-600 dark:text-blue-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    if (score >= 60) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  if(!studentData) {
    return (
      <>
        <LoadingEvaluation />
      </>
    )
  }


  return (
    <div className="space-y-6 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex items-center justify-between container mx-auto px-4 py-6 sm:py-12">
        <Button 
          variant="ghost" 
          onClick={() => window.history.back()} 
          className="flex items-center gap-1 text-sm sm:text-base"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          Back to Form
        </Button>
        <div className="flex items-center gap-1">
          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
          <span className="font-semibold text-sm sm:text-base">AI Evaluation</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-12">
        <div className="max-w-3xl mx-auto">

      <Card className="p-4 sm:p-6 md:p-8 overflow-hidden">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Candidate Evaluation Results</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Our AI has analyzed your profile and generated the following evaluation.
          </p>
        </div>

        <div className="mb-8">
          <h3 className="text-lg sm:text-xl font-semibold mb-3">Overall Score</h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
            <div className="relative h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0 mx-auto sm:mx-0">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-2xl sm:text-3xl font-bold ${getScoreColorClass(studentData.scores.overall)}`}>
                  {studentData.scores.overall}%
                </span>
              </div>
              {/* <svg className="h-full w-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#e6e6e6"
                  strokeWidth="10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 45 * scores.overall / 100} ${2 * Math.PI * 45 * (1 - scores.overall / 100)}`}
                  strokeDashoffset={2 * Math.PI * 45 * 0.25}
                  className={getScoreColorClass(studentData.scores.overall)}
                />
              </svg> */}
            </div>
            <div className="flex-1 space-y-3 text-center sm:text-left">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Rating</span>
                <h4 className={`text-lg sm:text-xl font-semibold ${getScoreColorClass(studentData.scores.overall)}`}>
                  {getScoreLabel(studentData.scores.overall)}
                </h4>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Technical</span>
                  <div className="flex items-center gap-1">
                    <Progress value={studentData.scores.technical} className="h-2" />
                    <span className="text-xs font-medium">{studentData.scores.technical}%</span>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Experience</span>
                  <div className="flex items-center gap-1">
                    <Progress value={studentData.scores.experience} className="h-2" />
                    <span className="text-xs font-medium">{studentData.scores.experience}%</span>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Communication</span>
                  <div className="flex items-center gap-1">
                    <Progress value={studentData.scores.communication} className="h-2" />
                    <span className="text-xs font-medium">{studentData.scores.communication}%</span>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Job Fit</span>
                  <div className="flex items-center gap-1">
                    <Progress value={studentData.scores.jobFit} className="h-2" />
                    <span className="text-xs font-medium">{studentData.scores.jobFit}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="summary" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="summary" className="text-xs sm:text-sm">
              Summary
            </TabsTrigger>
            <TabsTrigger value="skills" className="text-xs sm:text-sm">
              Skills
            </TabsTrigger>
            <TabsTrigger value="experience" className="text-xs sm:text-sm">
              Experience
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="text-xs sm:text-sm">
              Recommendations
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="space-y-4">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-base sm:text-lg mb-2">Profile Summary</h3>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {studentData.extractSections.summary}
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="skills" className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-base sm:text-lg mb-2">Skill Assessment</h3>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {studentData.extractSections.skillAssessment}
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="experience" className="space-y-4">
            <div className="flex items-start gap-3">
              <Award className="h-5 w-5 text-purple-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-base sm:text-lg mb-2">Experience Evaluation</h3>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {studentData.extractSections.experienceEvaluation}
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="recommendations" className="space-y-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-base sm:text-lg mb-2">Recommendations</h3>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {studentData.extractSections.recommendations}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      </div>
      </div>
    </div>
  );
}