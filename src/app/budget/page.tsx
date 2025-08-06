
'use client';

import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import { doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { PageWrapper } from '@/components/page-wrapper';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader, PlusCircle, Trash2, Wallet } from 'lucide-react';
import { ProtectedRoute } from '@/components/protected-route';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const expenseSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Item name is required'),
    category: z.string().min(1, 'Category is required'),
    amount: z.coerce.number().positive('Amount must be positive'),
});

const budgetSchema = z.object({
    totalBudget: z.coerce.number().positive('Total budget must be a positive number'),
    expenses: z.array(expenseSchema),
});

type BudgetFormValues = z.infer<typeof budgetSchema>;

const expenseCategories = ['Venue', 'Catering', 'Decorations', 'Entertainment', 'Transport', 'Photography', 'Attire', 'Other'];

export default function BudgetPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);

    const form = useForm<BudgetFormValues>({
        resolver: zodResolver(budgetSchema),
        defaultValues: {
            totalBudget: 10000,
            expenses: [],
        },
    });
    
    const { fields, append, remove, update } = useFieldArray({
        control: form.control,
        name: 'expenses',
    });

    const totalBudget = form.watch('totalBudget');
    const expenses = form.watch('expenses');
    const totalSpent = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    const remaining = totalBudget - totalSpent;
    const spentPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    useEffect(() => {
        if (!user) return;
        const budgetDocRef = doc(db, 'budgets', user.uid);
        const unsubscribe = onSnapshot(budgetDocRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data() as BudgetFormValues;
                form.reset(data);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [user, form]);
    
    const onSubmit = async (data: BudgetFormValues) => {
        if (!user) return;
        try {
            await setDoc(doc(db, 'budgets', user.uid), {
                ...data,
                updatedAt: serverTimestamp(),
            });
            toast({
                title: 'Budget Saved',
                description: 'Your budget has been successfully updated.',
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to save budget.',
            });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    return (
        <ProtectedRoute>
            <PageWrapper
                icon={Wallet}
                title="Budget"
                description="Manage your event expenses and stay on top of your budget."
            >
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-5xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle>Budget Overview</CardTitle>
                             <div className="flex items-center gap-4 pt-2">
                                <Label htmlFor="total-budget" className="whitespace-nowrap">Total Budget ($)</Label>
                                <Input
                                    id="total-budget"
                                    type="number"
                                    className="max-w-xs"
                                    {...form.register('totalBudget')}
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Total Spent</CardTitle>
                                    <CardDescription>${totalSpent.toFixed(2)}</CardDescription>
                                </CardHeader>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Remaining</CardTitle>
                                    <CardDescription 
                                        className={cn(remaining < 0 && "text-destructive")}
                                    >
                                        ${remaining.toFixed(2)}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                            <div className="md:col-span-3">
                                <Progress value={spentPercentage} className="w-full" />
                                <p className="text-sm text-muted-foreground mt-2 text-center">{spentPercentage.toFixed(0)}% of budget used</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Expenses</CardTitle>
                            <CardDescription>Add and manage your expense items.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Desktop Table View */}
                            <div className="hidden md:block">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Item</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead className="text-right">Amount ($)</TableHead>
                                            <TableHead className="w-[50px]"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {fields.map((field, index) => (
                                            <TableRow key={field.id}>
                                                <TableCell>
                                                    <Input {...form.register(`expenses.${index}.name`)} />
                                                </TableCell>
                                                <TableCell>
                                                    <Select
                                                        onValueChange={(value) => update(index, { ...field, category: value })}
                                                        defaultValue={field.category}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Category" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {expenseCategories.map(cat => (
                                                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                                <TableCell>
                                                    <Input type="number" {...form.register(`expenses.${index}.amount`)} className="text-right" />
                                                </TableCell>
                                                <TableCell>
                                                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="md:hidden space-y-4">
                                {fields.map((field, index) => (
                                    <Card key={field.id} className="p-4 space-y-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <Input 
                                                placeholder="Expense Name"
                                                className="text-lg font-semibold border-none shadow-none p-0 focus-visible:ring-0"
                                                {...form.register(`expenses.${index}.name`)} 
                                            />
                                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                         <Select
                                            onValueChange={(value) => update(index, { ...field, category: value })}
                                            defaultValue={field.category}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {expenseCategories.map(cat => (
                                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <div className="flex items-center gap-2">
                                            <span className="text-muted-foreground">$</span>
                                            <Input type="number" placeholder='0.00' {...form.register(`expenses.${index}.amount`)} />
                                        </div>
                                    </Card>
                                ))}
                            </div>

                             <Button
                                type="button"
                                variant="outline"
                                className="mt-4"
                                onClick={() => append({ name: '', category: '', amount: 0 })}
                            >
                                <PlusCircle className="mr-2 h-4 w-4" /> Add Expense
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                           {form.formState.isSubmitting ? <Loader className="animate-spin mr-2" /> : null}
                           Save Budget
                        </Button>
                    </div>
                </form>
            </PageWrapper>
        </ProtectedRoute>
    );
}
