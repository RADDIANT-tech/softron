import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { toast } from 'sonner';
import { Calendar as CalendarIcon, Check, CircleCheck, CircleX, Mail, MapPin, Phone, Signature, User } from "lucide-react";
import { cn } from "@/lib/utils";
import AnimatedInput from './AnimatedInput';
import SuccessModal from './SuccessModal';

const formSchema = z.object({
  fullName: z.string().min(3, {
    message: "Full name must be at least 3 characters.",
  }),
  dateOfBirth: z.date({
    required_error: "Date of birth is required.",
  }),
  phoneNumber: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  blockCourt: z.string({
    required_error: "Please select a block or court.",
  }),
  roomType: z.string({
    required_error: "Please select a room type.",
  }),
  roomNumber: z.string().min(1, {
    message: "Room number is required.",
  }),
  isCustodian: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const RegistrationForm: React.FC = () => {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isNameValid, setIsNameValid] = useState<boolean | undefined>(undefined);
  const [isPhoneValid, setIsPhoneValid] = useState<boolean | undefined>(undefined);
  const [isRoomNumberValid, setIsRoomNumberValid] = useState<boolean | undefined>(undefined);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      blockCourt: "",
      roomType: "",
      roomNumber: "",
      isCustodian: false,
    },
  });
  
  const watchIsCustodian = form.watch("isCustodian");
  
  // Validate full name with regex (letters, spaces, hyphens, and apostrophes)
  const validateName = (name: string) => {
    if (!name) return undefined;
    const nameRegex = /^[a-zA-Z\s'-]+$/;
    const isValid = nameRegex.test(name) && name.length >= 3;
    setIsNameValid(isValid);
    return isValid;
  };
  
  // Validate and format phone number
  const validatePhone = (phoneNumber: string) => {
    if (!phoneNumber) return undefined;
    // Simple validation for demo - requires at least 10 digits
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    const isValid = digitsOnly.length >= 10;
    setIsPhoneValid(isValid);
    return isValid;
  };
  
  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    if (!value) return "";
    
    // Keep only digits
    const digitsOnly = value.replace(/\D/g, '');
    
    // Format based on length
    if (digitsOnly.length <= 3) {
      return `+${digitsOnly}`;
    } else if (digitsOnly.length <= 6) {
      return `+${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3)}`;
    } else if (digitsOnly.length <= 9) {
      return `+${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3, 6)} ${digitsOnly.slice(6)}`;
    } else {
      return `+${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3, 6)} ${digitsOnly.slice(6, 9)} ${digitsOnly.slice(9, 12)}`;
    }
  };
  
  // Validate room number (numeric only)
  const validateRoomNumber = (roomNumber: string) => {
    if (!roomNumber) return undefined;
    const isValid = /^\d+$/.test(roomNumber);
    setIsRoomNumberValid(isValid);
    return isValid;
  };
  
  const onSubmit = async (data: FormValues) => {
    const payload = {
      ...data,
      dateOfBirth: data.dateOfBirth.toISOString().split("T")[0], // Format as YYYY-MM-DD
      phoneNumber: `'${data.phoneNumber}'`, // Prevent #ERROR! in Google Sheets
    };
  
console.log({payload: JSON.stringify(payload)});

    toast.promise(
      // CORS-safe: mode set to "no-cors"
      fetch("https://script.google.com/macros/s/AKfycbyN3igjorFwTdGkWSFpPuHzTsGDS8me8oth8u9NLT7W_V6nVgSka8JNWBti1yucNkSa/exec", {
        method: "POST",
        mode: "no-cors", // <== disables CORS enforcement
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      }).then(() => {
        // You won’t get a JSON response, so we just proceed after request
        setTimeout(() => setIsSuccessModalOpen(true), 300);
      }),
      {
        loading: "Connecting you to Pentagon WiFi...",
        success: "Registration complete!",
        error: "Registration failed. Please try again.",
      }
    );
  };
  

  // Auto-capitalize name while typing
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'fullName' && typeof value.fullName === 'string') {
        // Auto-capitalize first letter of each word
        const capitalized = value.fullName.replace(/\b\w/g, c => c.toUpperCase());
        if (capitalized !== value.fullName) {
          form.setValue('fullName', capitalized);
        }
        validateName(capitalized);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Full Name */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <AnimatedInput
                    id="fullName"
                    label="Full Name"
                    type="text"
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e);
                      validateName(e.target.value);
                    }}
                    icon={<Signature className="h-5 w-5" />}
                    validationIcon={isNameValid ? <CircleCheck className="h-5 w-5" /> : <CircleX className="h-5 w-5" />}
                    isValid={isNameValid}
                    autoComplete="name"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          {/* Date of Birth */}
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <div className="relative form-field-animation rounded-lg max-w-md">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <div className="flex items-center border-2 rounded-lg overflow-hidden">
                          <div className="flex items-center justify-center pl-3 text-gray-500">
                            <CalendarIcon className="h-5 w-5" />
                          </div>
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-start text-left font-normal py-3 px-2 h-auto",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Date of Birth</span>}
                          </Button>
                        </div>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white" align="start">
                      
                    </PopoverContent>
                  </Popover>
                </div>
              </FormItem>
            )}
          />
          
          {/* Phone Number */}
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <AnimatedInput
                    id="phoneNumber"
                    label="Phone Number"
                    type="tel"
                    value={field.value}
                    onChange={(e) => {
                      const formattedValue = formatPhoneNumber(e.target.value);
                      field.onChange(formattedValue);
                      validatePhone(formattedValue);
                    }}
                    icon={<Phone className="h-5 w-5" />}
                    validationIcon={isPhoneValid ? <CircleCheck className="h-5 w-5" /> : <CircleX className="h-5 w-5" />}
                    isValid={isPhoneValid}
                    autoComplete="tel"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {/* problem with not submitting inside of sheets */}
            {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <AnimatedInput
                  id="email"
                  label="Email"
                  type="email"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e);
                  }}
                  icon={<Mail className="h-5 w-5" />}
                  validationIcon={field.value && formSchema.shape.email.safeParse(field.value).success ? <CircleCheck className="h-5 w-5" /> : <CircleX className="h-5 w-5" />}
                  isValid={field.value && formSchema.shape.email.safeParse(field.value).success}
                  autoComplete="email"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Block / Court */}
          <FormField
  control={form.control}
  name="blockCourt"
  render={({ field }) => (
    <FormItem className="form-field-animation">
      <div className="relative max-w-md">
        <div className="flex items-center border-2 rounded-lg overflow-hidden border-gray-200 focus-within:border-primary transition-colors">
          {/* Icon inside the input box */}
          <div className="pl-3 text-gray-500">
            <MapPin className="h-5 w-5 animate-pulse-slow" />
          </div>

          {/* Select dropdown */}
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger className="w-full border-none shadow-none focus:ring-0 focus:outline-none px-3 py-3 bg-transparent">
              <SelectValue placeholder="Select Block / Court" />
            </SelectTrigger>
            <SelectContent className="bg-white z-[100]">
              <SelectItem value="block-a">Block A</SelectItem>
              <SelectItem value="block-b">Block B</SelectItem>
              <SelectItem value="block-c">Block C</SelectItem>
              <SelectItem value="addis-ababa">Addis-Ababa Court</SelectItem>
              <SelectItem value="dar-es-salam">Dar es Salam Court</SelectItem>
              <SelectItem value="kampala">Kampala Court</SelectItem>
              <SelectItem value="nairobi">Nairobi Court</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </FormItem>
  )}
/>
          {/* Room Type */}
<FormField
  control={form.control}
  name="roomType"
  render={({ field }) => (
    <FormItem className="form-field-animation">
      <div className="relative max-w-md">
        <div className="flex items-center border-2 rounded-lg overflow-hidden border-gray-200 focus-within:border-primary transition-colors">
          {/* Icon inside the input box */}
          <div className="pl-3 text-gray-500">
            <User className="h-5 w-5" />
          </div>

          {/* Select dropdown */}
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger className="w-full border-none shadow-none focus:ring-0 focus:outline-none px-3 py-3 bg-transparent">
              <SelectValue placeholder="Select Room Type" />
            </SelectTrigger>
            <SelectContent className="bg-white z-[100]">
              <SelectItem value="one-in-room">1 in a room</SelectItem>
              <SelectItem value="two-in-room">2 in a room</SelectItem>
              <SelectItem value="three-in-room">3 in a room</SelectItem>
              <SelectItem value="four-in-room">4 in a room</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </FormItem>
  )}
/>

          
          {/* Room Number */}
          <FormField
            control={form.control}
            name="roomNumber"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <AnimatedInput
                    id="roomNumber"
                    label="Room Number"
                    type="text"
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e);
                      validateRoomNumber(e.target.value);
                    }}
                    validationIcon={isRoomNumberValid ? <CircleCheck className="h-5 w-5" /> : <CircleX className="h-5 w-5" />}
                    isValid={isRoomNumberValid}
                    maxWidth="max-w-[150px]"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          {/* Be a Custodian */}
<div className="pt-4 border-t border-gray-200">
  <div className="bg-gradient-to-r from-primary/5 to-accent/10 p-5 rounded-lg space-y-5">
    {/* Headline and Perks */}
    <div>
      <h3 className="text-xl font-bold text-primary mb-1">Host. Lead. Connect.</h3>
      <p className="text-sm text-gray-600 max-w-md">
        Want more than just connection? Become a <strong>Custodian</strong> and get:
      </p>
      <ul className="list-disc pl-6 text-sm text-gray-600 mt-2">
        <li>50% extra data weekly</li>
        <li>Priority support</li>
      </ul>
    </div>

    {/* Yes/No Decision */}
    <FormField
      control={form.control}
      name="isCustodian"
      render={({ field }) => (
        <FormItem className="flex flex-col gap-3">
          <div className="flex gap-4 flex-col sm:flex-row">
            {/* YES option */}
            <button
              type="button"
              onClick={() => field.onChange(true)}
              className={cn(
                "flex-1 border-2 rounded-lg p-4 text-left transition-all",
                field.value ? "border-primary bg-white shadow" : "border-gray-200 hover:border-primary/50"
              )}
            >
              <span className="text-md font-semibold text-primary">Yes — I'm Ready to Be a Custodian</span>
<p className="text-sm text-gray-600 mt-1">Unlock bonus data, support, and exclusive access.</p>
            </button>

            {/* NO option */}
            <button
              type="button"
              onClick={() => field.onChange(false)}
              className={cn(
                "flex-1 border-2 rounded-lg p-4 text-left transition-all",
                !field.value ? "border-primary bg-white shadow" : "border-gray-200 hover:border-primary/50"
              )}
            >
              <span className="text-md font-semibold text-gray-800">No — I'll Just Stay Connected</span>
<p className="text-sm text-gray-600 mt-1">I'm happy to connect without extra responsibilities.</p>
            </button>
          </div>

          {/* Inline confirmation */}
          {field.value && (
            <p className="text-sm text-green-700 font-medium mt-2">
            ✔ You’re applying as a Custodian — welcome aboard!
            </p>
          )}
        </FormItem>
      )}
    />
  </div>
</div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full py-6 text-lg bg-primary hover:bg-primary/90 transition-all duration-300 hover:shadow-lg"
            >
              Connect Me
              <Check className="h-5 w-5 mr-2" />
            </Button>
          </div>
        </form>
      </Form>
      {/* ss */}
      
      <SuccessModal 
        open={isSuccessModalOpen} 
        onClose={() => setIsSuccessModalOpen(false)} 
      />
    </div>
  );
};

export default RegistrationForm;
