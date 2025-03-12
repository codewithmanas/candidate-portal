"use client";

import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from "@/components/ui/card";
import { Progress } from '@/components/ui/progress';
import { Upload, CheckCircle, X } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
// import { useRouter } from 'next/navigation';
import { uploadFileToSupabase } from '@/utils/uploadFileToSupabase';
// import PdfParse from 'pdf-parse';
import { storeDataToSupabase } from '@/utils/storeDataToSupabase';
// import { cleanDataIntoNormalText } from '@/utils/cleanDataIntoNormalText';
import { generateEmbeddings } from '@/actions/generateEmbeddings';
import LoadingEvaluation from './LoadingEvaluation';
import ReactMarkdown from "react-markdown";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";




export enum StatusText {
  UPLOADING = "Uploading file...",
  UPLOADED = "File uploaded successfully",
  SAVING = "Saving file to database...",
  GENERATING = "Generating AI Embeddings, This will only take a few seconds...",
}

export type Status = StatusText[keyof StatusText];


// Define the form schema
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  linkedinUrl: z.string().url("Invalid LinkedIn URL"),
  skills: z.string().min(10, "Please provide more details about your skills"),
  experience: z
    .string()
    .min(50, "Please provide more details about your experience"),
});

export default function CandidateForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status | null>(null);
  const [queryResult, setQueryResult] = useState("");

  // const router = useRouter();

  // Define your
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      linkedinUrl: "",
      skills: "",
      experience: "",
    },
  });

  // console.log("form", form);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setResumeFile(acceptedFiles[0]);
      simulateUploadProgress();
    },
  });

  const simulateUploadProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };


  const handleRemoveFile = () => {
    setResumeFile(null);
    setUploadProgress(0);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);

      console.log("values", values);

      if(!resumeFile) {
        throw new Error("upload resume and try again");
      }

      console.log("UPLOADING...");
      setStatus(StatusText.UPLOADING);

      const uploadsuccess = await uploadFileToSupabase(resumeFile);

      if(!uploadsuccess?.resumeUrl) {
        throw new Error("Failed to upload resume file");
      }

      console.log("UPLOADED...");
      setStatus(StatusText.UPLOADED);
      
          
          const formDataToStore = {
            name: values.name,
            email: values.email,
            linkedin_url: values.linkedinUrl,
            resume_url: uploadsuccess?.resumeUrl,
            skill: values.skills,
            experience: values.experience,
            // extracted_text: parsedData.text
          }

          console.log("SAVING...");
          setStatus(StatusText.SAVING);

          const storeDataResult = await storeDataToSupabase(formDataToStore);
          
          if(!storeDataResult) {
            throw new Error("Failed to store to database");
          }

          console.log("GENERATING...");
          setStatus(StatusText.GENERATING);

          const embeddingsResult = await generateEmbeddings(resumeFile, storeDataResult[0].id);


          if(embeddingsResult) {
                // Step 2: Redirect Immediately
              // Show Processing Screen
              // router.push(`/profile/${storeDataResult[0].id}`);

              console.log("embeddingsResult: ", embeddingsResult);

              // setQueryResult(embeddingsResult);
              
              const parsedData = JSON.stringify(embeddingsResult);
              
              console.log("parsedData: ", parsedData);
              setQueryResult(embeddingsResult);

          }













      // const formData = new FormData();
      // formData.append('name', (values.name));
      // formData.append('email', (values.email));
      // formData.append('linkedinUrl', (values.linkedinUrl));
      // formData.append('skills', (values.skills));
      // formData.append('experience', (values.experience));

      // if (resumeFile) {
      //   console.log("resumeFile", resumeFile);
      //   formData.append('resume', resumeFile);
      // }

      // console.log("formData: ", formData);

      // const response = await fetch('/api/submit-application', {
      //   method: 'POST',
      //   // body: formData,
      //   body: ""
      // });

      // console.log("response", response);

      // if (!response.ok) {
      //   throw new Error('Failed to submit application');
      // }

      // const data = await response.json();

      // console.log("data: ", data);


      // // Handle success
      // console.log('Application submitted successfully');

      // // Step 2: Redirect Immediately
      // // Show Processing Screen
      // router.push(`/profile/${data.data.id}`); 

    } catch (error) {
      console.error('Error submitting application:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  if(queryResult) {
      const markdownText = `
        ${queryResult}
      `

    return (
      <div className="max-w-3xl max-auto overflow-x-scroll">
      <ReactMarkdown
            // components={{
            //   code({  inline, className, children, ...props }) {
            //     const match = /language-(\w+)/.exec(className || "");
            //     return !inline && match ? (
            //       <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div" {...props}>
            //         {String(children).replace(/\n$/, "")}
            //       </SyntaxHighlighter>
            //     ) : (
            //       <code className={className} {...props}>
            //         {children}
            //       </code>
            //     );
            //   },
            // }}
      >
        {markdownText}
      </ReactMarkdown>
      </div>
    )

  }


    if(status) {
      return (
        <>
          <LoadingEvaluation status={status as string} />
        </>
      )
    }



  return (
    <Card className="p-4 sm:p-6 md:p-8">

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-6"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>

                <FormLabel className="text-sm sm:text-base">
                  Full Name
                </FormLabel>

                <FormControl>
                  <Input
                    placeholder="Enter your name"
                    {...field}
                    className="h-10 sm:h-12 text-base"
                  />
                </FormControl>

                <FormMessage className="text-xs sm:text-sm" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>

                <FormLabel className="text-sm sm:text-base">Email</FormLabel>

                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    type="email"
                    {...field}
                    className="h-10 sm:h-12 text-base"
                  />
                </FormControl>

                <FormMessage className="text-xs sm:text-sm" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="linkedinUrl"
            render={({ field }) => (
              <FormItem>

                <FormLabel className="text-sm sm:text-base">
                  LinkedIn URL
                </FormLabel>

                <FormControl>
                  <Input
                    placeholder="Enter your LinkedIn URL"
                    {...field}
                    className="h-10 sm:h-12 text-base"
                  />
                </FormControl>

                <FormMessage className="text-xs sm:text-sm" />
              </FormItem>
            )}
          />

          <div className="space-y-3 sm:space-y-4">
            <FormLabel className="text-sm sm:text-base">
              Resume Upload
            </FormLabel>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center cursor-pointer transition-colors
                ${
                  isDragActive
                    ? "border-primary bg-primary/5"
                    : "border-gray-300 hover:border-primary"
                }`}
            >
              <input {...getInputProps()} />

              <Upload className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />

              <p className="mt-2 text-sm text-gray-600">
                Drag & drop your resume here, or click to select file
              </p>

              <p className="text-xs text-gray-500 mt-1">PDF files only</p>

            </div>
            {resumeFile && (
              <div className="mt-3 sm:mt-4">
                <div className="w-full flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-2">

                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />

                  <span className="text-xs sm:text-sm text-gray-700 line-clamp-1">
                    {resumeFile.name.toString().split(".")[0].slice(0, 20) + "..." + "." + resumeFile.name.toString().split(".")[resumeFile.name.toString().split(".").length - 1]}
                  </span>

                </div>

                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="text-gray-500 hover:text-red-500 transition-colors"
                    aria-label="Remove file"
                  >
                    <X className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>

                <Progress value={uploadProgress} className="h-1.5 sm:h-2" />
              </div>
            )}
          </div>

          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem>

                <FormLabel className="text-sm sm:text-base">Skills</FormLabel>

                <FormControl>
                  <Textarea
                    placeholder="List your key technical and soft skills..."
                    className="min-h-[80px] sm:min-h-[100px] text-base"
                    {...field}
                  />
                </FormControl>

                <FormMessage className="text-xs sm:text-sm" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>

                <FormLabel className="text-sm sm:text-base">
                  Experience
                </FormLabel>

                <FormControl>
                  <Textarea
                    placeholder="Describe your relevant work experience..."
                    className="min-h-[120px] sm:min-h-[150px] text-base"
                    {...field}
                  />
                </FormControl>

                <FormMessage className="text-xs sm:text-sm" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full h-10 sm:h-12 text-sm sm:text-base mt-4 sm:mt-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </form>
      </Form>
    </Card>
  );
}
