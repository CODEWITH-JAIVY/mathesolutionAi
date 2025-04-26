'use client';

import {useState} from 'react';
import {
  AnswerFollowUpQuestionInput,
  answerFollowUpQuestion,
} from '@/ai/flows/answer-follow-up-question';
import {
  SolveMathProblemInput,
  solveMathProblem,
} from '@/ai/flows/solve-math-problem';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Textarea} from '@/components/ui/textarea';
import {useToast} from '@/hooks/use-toast';

export default function Home() {
  const [problemText, setProblemText] = useState('');
  const [problemImage, setProblemImage] = useState<string | null>(null);
  const [solution, setSolution] = useState<string | null>(null);
  const [
    chatMessages,
    setChatMessages,
  ] = useState<{role: 'user' | 'assistant'; content: string}[]>([]);
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const {toast} = useToast();

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

      setChatMessages(prev => [
        ...prev,
        {role: 'user', content: followUpQuestion},
        {role: 'assistant', content: result.answer},
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
    <div className="container mx-auto p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-2xl">MathVision</CardTitle>
          <CardDescription>Submit math problems via text or image.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Textarea
            placeholder="Enter math problem..."
            value={problemText}
            onChange={e => {
              setProblemText(e.target.value);
              setProblemImage(null); // Clear image when text is entered
            }}
          />
          <div className="flex items-center space-x-2">
            <Input
              type="file"
              accept="image/*"
              onChange={e => {
                handleImageUpload(e);
                setProblemText(''); // Clear text when image is uploaded
              }}
            />
          </div>
          <Button onClick={handleProblemSubmit} disabled={loading}>
            {loading ? 'Solving...' : 'Solve Problem'}
          </Button>
        </CardContent>
      </Card>

      {solution && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Solution:</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whiteboard rounded-md p-4 bg-f0f8ff text-black shadow-md">
              <pre>{solution}</pre>
            </div>
          </CardContent>
        </Card>
      )}

      {solution && (
        <Card>
          <CardHeader>
            <CardTitle>Follow-up Questions</CardTitle>
            <CardDescription>Ask questions about the solution.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] mb-4 p-2 rounded-md bg-e6e6fa">
              <div className="space-y-2">
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div className="flex items-center">
                      {message.role === 'assistant' && (
                        <Avatar className="mr-2">
                          <AvatarImage
                            src="https://picsum.photos/id/66/50/50"
                            alt="Assistant"
                          />
                          <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`rounded-md p-2 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground'
                        }`}
                      >
                        {message.content}
                      </div>
                      {message.role === 'user' && (
                        <Avatar className="ml-2">
                          <AvatarImage
                            src="https://picsum.photos/id/11/50/50"
                            alt="User"
                          />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Ask a follow-up question..."
                value={followUpQuestion}
                onChange={e => setFollowUpQuestion(e.target.value)}
              />
              <Button onClick={handleFollowUpSubmit} disabled={loading}>
                {loading ? 'Answering...' : 'Ask'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
