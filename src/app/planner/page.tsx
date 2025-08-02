
'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
  Form,
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
  Lightbulb,
} from 'lucide-react';
import { suggestEventIdeas, SuggestEventIdeasOutput } from '@/ai/flows/suggest-event-ideas';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  eventType: z.string().min(2, {
    message: 'Event type must be at least 2 characters.',
  }),
  guestCount: z.coerce.number().int().positive({
    message: 'Please enter a valid number of guests.',
  }),
  budget: z.coerce.number().positive({
    message: 'Please enter a valid budget.',
  }),
  additionalInfo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function PlannerPage() {
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<SuggestEventIdeasOutput | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
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
    try {
      const result = await suggestEventIdeas(values);
      setIdeas(result);
    } catch (error) {
      console.error('Error generating event ideas:', error);
      // You might want to show a toast notification here
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <Lightbulb className="mx-auto h-12 w-12 text-primary mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold font-headline">
            AI Event Planner
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Describe your event, and let our AI assistant spark your imagination!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Tell us about your event</CardTitle>
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
                        <FormLabel>Event Type</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Birthday Party, Corporate Gala" {...field} />
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
                <CardFooter>
                  <p className="text-xs text-muted-foreground">
                    These are just suggestions! Feel free to mix, match, and customize them.
                  </p>
                </CardFooter>
              </Card>
            )}
            {!loading && !ideas && (
              <Card className="border-dashed">
                <CardContent className="p-10 text-center">
                   <div className="mx-auto w-fit bg-secondary p-4 rounded-full mb-4">
                     <Lightbulb className="w-8 h-8 text-muted-foreground" />
                   </div>
                  <p className="text-muted-foreground">Your event ideas will appear here.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
