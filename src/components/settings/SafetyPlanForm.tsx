
"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUser, useFirestore, useDoc, useMemoFirebase, setDocumentNonBlocking } from "@/firebase";
import { doc } from "firebase/firestore";
import type { SafetyPlan } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, User, LifeBuoy, ShieldCheck, PlusCircle } from "lucide-react";
import { Separator } from "../ui/separator";

const contactSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
});

const resourceSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Name is required"),
    phone: z.string().min(1, "Phone is required"),
});

const safetyPlanSchema = z.object({
  trustedContacts: z.array(contactSchema),
  emergencyResources: z.array(resourceSchema),
  copingStrategies: z.string().optional(),
});

export default function SafetyPlanForm() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const safetyPlanRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, `userProfiles/${user.uid}/safetyPlan/userPlan`);
  }, [user, firestore]);
  
  const { data: safetyPlan, isLoading: isPlanLoading } = useDoc<SafetyPlan>(safetyPlanRef);

  const form = useForm<z.infer<typeof safetyPlanSchema>>({
    resolver: zodResolver(safetyPlanSchema),
    defaultValues: {
      trustedContacts: [],
      emergencyResources: [],
      copingStrategies: "",
    },
  });

  const { fields: contactFields, append: appendContact, remove: removeContact } = useFieldArray({
    control: form.control,
    name: "trustedContacts",
  });

  const { fields: resourceFields, append: appendResource, remove: removeResource } = useFieldArray({
    control: form.control,
    name: "emergencyResources",
  });

  useEffect(() => {
    if (safetyPlan) {
      form.reset({
        trustedContacts: safetyPlan.trustedContacts || [],
        emergencyResources: safetyPlan.emergencyResources || [{ id: '988', name: 'National Crisis Hotline', phone: '988' }],
        copingStrategies: safetyPlan.copingStrategies || "",
      });
    } else {
        // Pre-populate with default if no plan exists
         form.reset({
            trustedContacts: [],
            emergencyResources: [{ id: '988', name: 'National Crisis Hotline', phone: '988' }],
            copingStrategies: "",
        });
    }
  }, [safetyPlan, form]);
  
  const { isSubmitting } = form.formState;

  const handleUpdatePlan = async (values: z.infer<typeof safetyPlanSchema>) => {
    if (!safetyPlanRef) return;
    try {
      await setDocumentNonBlocking(safetyPlanRef, values, { merge: true });
      toast({
        title: "Safety Plan Saved",
        description: "Your plan has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "An unexpected error occurred.",
      });
    }
  };

  if (isPlanLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdatePlan)}
            className="space-y-8"
          >
            {/* Trusted Contacts */}
            <div className="space-y-4">
                <CardTitle className="flex items-center gap-2 text-lg"><User className="w-5 h-5"/>Trusted Contacts</CardTitle>
                {contactFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end p-2 border rounded-md">
                        <FormField control={form.control} name={`trustedContacts.${index}.name`} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name={`trustedContacts.${index}.phone`} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeContact(index)}><Trash2 className="w-4 h-4 text-destructive"/></Button>
                    </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => appendContact({ id: crypto.randomUUID(), name: '', phone: '' })}>
                    <PlusCircle className="mr-2 h-4 w-4"/>
                    Add Contact
                </Button>
            </div>

            <Separator/>
            
            {/* Emergency Resources */}
            <div className="space-y-4">
                <CardTitle className="flex items-center gap-2 text-lg"><LifeBuoy className="w-5 h-5"/>Emergency Resources</CardTitle>
                {resourceFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end p-2 border rounded-md">
                        <FormField control={form.control} name={`emergencyResources.${index}.name`} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Resource Name</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name={`emergencyResources.${index}.phone`} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeResource(index)}><Trash2 className="w-4 h-4 text-destructive"/></Button>
                    </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => appendResource({ id: crypto.randomUUID(), name: '', phone: '' })}>
                     <PlusCircle className="mr-2 h-4 w-4"/>
                    Add Resource
                </Button>
            </div>
            
            <Separator/>

            {/* Coping Strategies */}
            <div className="space-y-4">
                 <CardTitle className="flex items-center gap-2 text-lg"><ShieldCheck className="w-5 h-5"/>My Coping Strategies</CardTitle>
                <FormField
                    control={form.control}
                    name="copingStrategies"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Personal Strategies</FormLabel>
                        <FormControl>
                            <Textarea {...field} placeholder="e.g., 1. Go for a walk. 2. Listen to my 'Calm' playlist. 3. Call my mom." rows={6}/>
                        </FormControl>
                         <FormDescription>Write down actions that help you feel calmer or safer.</FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Plan
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
