'use client';

import { useState } from 'react';
import { AnswerFollowUpQuestionInput, answerFollowUpQuestion } from '@/ai/flows/answer-follow-up-question';
import { SolveMathProblemInput, solveMathProblem } from '@/ai/flows/solve-math-problem';
import { GithubIcon, InstagramIcon, LinkedinIcon, Youtube } from 'lucide-react';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [problemText, setProblemText] = useState('');
  const [problemImage, setProblemImage] = useState<string | null>(null);
  const [solution, setSolution] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleProblemSubmit = async () => {
    setLoading(true);
    try {
      let input: SolveMathProblemInput = {};
      if (problemText) {
        input.problemText = problemText;
      } else if (problemImage) {
        input.problemImage = problemImage;
      } else {
        toast({
          title: 'Error',
          description: 'Please provide either a text problem or an image.',
        });
        return;
      }

      const result = await solveMathProblem(input);
      setSolution(result.solution);
      setChatMessages([]); // Clear chat on new problem
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to solve the problem.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFollowUpSubmit = async () => {
    if (!solution) {
      toast({
        title: 'Error',
        description: 'Solve a problem first before asking a follow-up.',
      });
      return;
    }
    setLoading(true);
    try {
      const input: AnswerFollowUpQuestionInput = {
        question: followUpQuestion,
        previousSolution: solution,
      };
      const result = await answerFollowUpQuestion(input);

      setChatMessages((prev) => [
        ...prev,
        { role: 'user', content: followUpQuestion },
        { role: 'assistant', content: result.answer },
      ]);
      setFollowUpQuestion('');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to answer the follow-up question.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProblemImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      {/* Header */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200">
        <div className="container mx-auto flex items-center justify-between p-4">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            CodeWithJaivy
          </Link>

          <Sheet>
            <SheetTrigger className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full">
              About
            </SheetTrigger>
            <SheetContent className="p-4">
              <SheetHeader className="mb-4">
                <SheetTitle className="text-2xl font-bold text-gray-800">✨ About Me</SheetTitle>
              </SheetHeader>

              <div className="text-gray-700 space-y-4">
                <p>Welcome to CodeWithJaivy! I'm Jaivy Roy, a passionate full-stack developer and tech enthusiast.</p>
                <p>I build user-friendly and innovative web platforms that make learning interactive and fun.</p>
                <p><strong>Frontend:</strong> HTML, CSS, JavaScript, React.js, Tailwind CSS</p>
                <p><strong>Backend:</strong> Node.js, Express.js, MongoDB</p>
                <p><strong>AI Integration:</strong> OpenAI API, Mathpix API</p>
                <p><strong>Vision:</strong> "Technology should not just inform, it should inspire."</p>
                <p>Through CodeWithJaivy, I empower students and educators with interactive learning experiences 🚀.</p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4 mt-24">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-2xl">MathVision</CardTitle>
            <CardDescription>Submit math problems via text or image.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Textarea
              placeholder="Enter math problem..."
              value={problemText}
              onChange={(e) => {
                setProblemText(e.target.value);
                setProblemImage(null); // Clear image when typing
              }}
            />
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                handleImageUpload(e);
                setProblemText(''); // Clear text when uploading
              }}
            />
            <Button onClick={handleProblemSubmit} disabled={loading}>
              {loading ? 'Solving...' : 'Solve Problem'}
            </Button>
          </CardContent>
        </Card>

        {/* Solution Whiteboard */}
        {solution && (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Solution:</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md p-4 bg-blue-50 text-black shadow-md overflow-auto">
                <pre>{solution}</pre>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Follow-up Questions */}
        {solution && (
          <Card>
            <CardHeader>
              <CardTitle>Follow-up Questions</CardTitle>
              <CardDescription>Ask anything about the solution.</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px] mb-4 p-2 rounded-md bg-purple-100">
                <div className="space-y-2">
                  {chatMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className="flex items-center">
                        {message.role === 'assistant' && (
                          <Avatar className="mr-2">
                            <AvatarImage src="https://picsum.photos/id/66/50/50" alt="Assistant" />
                            <AvatarFallback>AI</AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`rounded-md p-2 ${
                            message.role === 'user'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 text-black'
                          }`}
                        >
                          {message.content}
                        </div>
                        {message.role === 'user' && (
                          <Avatar className="ml-2">
                            <AvatarImage src="https://picsum.photos/id/11/50/50" alt="User" />
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="flex space-x-2 mt-2">
                <Input
                  type="text"
                  placeholder="Ask a follow-up question..."
                  value={followUpQuestion}
                  onChange={(e) => setFollowUpQuestion(e.target.value)}
                />
                <Button onClick={handleFollowUpSubmit} disabled={loading}>
                  {loading ? 'Answering...' : 'Ask'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 p-4 mt-10">
        <div className="container mx-auto flex justify-center space-x-6">
          <Link href="https://github.com/CODEWITH-JAIVY" target="_blank">
            <GithubIcon className="h-6 w-6 text-gray-600 hover:text-black" />
          </Link>
          <Link href="https://www.instagram.com/codewithjaivy?igsh=MWJtY3hleGo5NWxkNg==" target="_blank">
            <InstagramIcon className="h-6 w-6 text-gray-600 hover:text-black" />
          </Link>
          <Link href="https://www.linkedin.com/in/sanjeet-kumar-8a21171a3?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank">
            <LinkedinIcon className="h-6 w-6 text-gray-600 hover:text-black" />
          </Link>
          <Link href="https://www.youtube.com/@codewithjaivy" target="_blank">
            <Youtube className="h-6 w-6 text-gray-600 hover:text-black" />
          </Link>
        </div>
        <div className="text-center mt-4 text-gray-500">
          &copy; {new Date().getFullYear()} CodeWithJaivy. All rights reserved.
        </div>
      </footer>
    </>
  );
}
