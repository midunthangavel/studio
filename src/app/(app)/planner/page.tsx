
'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  PartyPopper,
  Paintbrush,
  Sparkles,
  Loader,
  Image as ImageIcon,
} from 'lucide-react';
import { suggestEventIdeas } from '@/ai/flows/suggest-event-ideas';
import { FormSchema, type SuggestEventIdeasOutput, type FormValues } from '@/ai/flows/suggest-event-ideas.types';
import { Separator } from '@/components/ui/separator';
import { PageWrapper } from '@/components/shared/page-wrapper';
import { useToast } from '@/hooks/use-toast';
import { ProtectedRoute } from '@/components/shared/protected-route';
import { generateMoodBoard } from '@/ai/flows/generate-mood-board';
import Image from 'next/image';


export default function PlannerPage() {
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<SuggestEventIdeasOutput | null>(null);
  const [isMoodBoardLoading, setIsMoodBoardLoading] = useState(false);
  const [moodBoardImage, setMoodBoardImage] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      eventType: '',
      guestCount: 50,
      budget: 5000,
      additionalInfo: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    setIdeas(null);
    setMoodBoardImage(null);
    try {
      const result = await suggestEventIdeas(values);
      setIdeas(result);
    } catch (error) {
      console.error('Error generating event ideas:', error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem generating your event ideas. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleGenerateMoodboard = async () => {
    if (!ideas?.theme) return;
    setIsMoodBoardLoading(true);
    setMoodBoardImage(null);
    try {
      const result = await generateMoodBoard({ 
        prompt: `A vibrant, high-quality mood board for an event with the theme: "${ideas.theme}". Include elements of decoration and atmosphere.` 
      });
      setMoodBoardImage(result);
    } catch (error) {
      console.error('Error generating mood board:', error);
      toast({
        variant: "destructive",
        title: "Mood Board Generation Failed",
        description: "There was a problem creating your mood board. Please try again.",
      });
    } finally {
      setIsMoodBoardLoading(false);
    }
  };

  return (
    <ProtectedRoute>
    <PageWrapper
        icon={Sparkles}
        title="AI Planner"
        description="Describe your function, and let our AI assistant spark your imagination!"
    >
      <div className="mx-auto max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Tell us about your function</CardTitle>
              <CardDescription>
                The more details you provide, the better the suggestions will be.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormProvider {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="eventType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Function Type</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Wedding, Anniversary, Ceremony" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="guestCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Guest Count</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="50" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="budget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Budget ($)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="5000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="additionalInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Information</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about the guest of honor, desired atmosphere, hobbies, favorite colors, etc."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Any extra details will help create more personalized ideas.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Generating Ideas...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Ideas
                      </>
                    )}
                  </Button>
                </form>
              </FormProvider>
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            {loading && (
              <Card>
                <CardContent className="p-6 text-center">
                  <Loader className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Generating creative ideas for you...</p>
                </CardContent>
              </Card>
            )}
            {ideas && (
              <Card>
                <CardHeader>
                  <CardTitle>Here are some ideas!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="flex items-center font-semibold mb-2">
                      <PartyPopper className="w-5 h-5 mr-2 text-primary" />
                      Theme Suggestions
                    </h3>
                    <p className="text-muted-foreground">{ideas.theme}</p>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="flex items-center font-semibold mb-2">
                      <Paintbrush className="w-5 h-5 mr-2 text-primary" />
                      Decoration Ideas
                    </h3>
                    <p className="text-muted-foreground">{ideas.decoration}</p>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="flex items-center font-semibold mb-2">
                      <Sparkles className="w-5 h-5 mr-2 text-primary" />
                      Activity Suggestions
                    </h3>
                    <p className="text-muted-foreground">{ideas.activity}</p>
                  </div>
                </CardContent>
                <CardFooter className='flex-col gap-4 items-stretch'>
                   <Button onClick={handleGenerateMoodboard} disabled={isMoodBoardLoading}>
                    {isMoodBoardLoading ? (
                        <>
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <ImageIcon className="mr-2 h-4 w-4" />
                            Generate Mood Board
                        </>
                    )}
                   </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    These are just suggestions! Feel free to mix, match, and customize them.
                  </p>
                </CardFooter>
              </Card>
            )}

            {isMoodBoardLoading && (
                 <Card>
                    <CardContent className="p-6 text-center">
                        <Loader className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                        <p className="text-muted-foreground">Creating your mood board...</p>
                    </CardContent>
                </Card>
            )}

            {moodBoardImage && (
                <Card>
                    <CardHeader>
                        <CardTitle>Visual Inspiration</CardTitle>
                         <CardDescription>A mood board for your &quot;{ideas?.theme}&quot; theme.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Image 
                            src={moodBoardImage}
                            alt="AI generated mood board"
                            width={512}
                            height={512}
                            className="rounded-lg w-full h-auto object-cover"
                        />
                    </CardContent>
                </Card>
            )}
            
            {!loading && !ideas && (
              <Card className="border-dashed">
                <CardContent className="p-10 text-center">
                   <div className="mx-auto w-fit bg-secondary p-4 rounded-full mb-4">
                     <Sparkles className="w-8 h-8 text-muted-foreground" />
                   </div>
                  <p className="text-muted-foreground">Your function ideas will appear here.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
    </ProtectedRoute>
  );
}
