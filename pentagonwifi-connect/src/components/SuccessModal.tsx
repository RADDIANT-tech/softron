import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { CircleCheck, Share } from 'lucide-react';
import { toast } from 'sonner';

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ open, onClose }) => {
  const [checkmarkVisible, setCheckmarkVisible] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);
  const [actionsVisible, setActionsVisible] = useState(false);

  useEffect(() => {
    if (open) {
      const checkmarkTimer = setTimeout(() => setCheckmarkVisible(true), 300);
      const messageTimer = setTimeout(() => setMessageVisible(true), 800);
      const actionsTimer = setTimeout(() => setActionsVisible(true), 1300);

      return () => {
        clearTimeout(checkmarkTimer);
        clearTimeout(messageTimer);
        clearTimeout(actionsTimer);
      };
    } else {
      setCheckmarkVisible(false);
      setMessageVisible(false);
      setActionsVisible(false);
    }
  }, [open]);

  function handleShareReferral(event: React.MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    if (navigator.share) {
      navigator
        .share({
          title: "Check out this amazing internet service!",
          text: "Join me in using this blazing-fast internet that #NeverSleeps. Click the link to learn more!",
          url: window.location.href,
        })
        .then(() => {
          toast.success("Referral shared successfully!");
        })
        .catch((error) => {
          console.error("Error sharing referral:", error);
          toast.error("Failed to share referral. Please try again.");
        });
    } else {
      toast.error("Sharing is not supported on this device.");
    }
  }
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-md flex flex-col items-center text-center p-6 bg-gradient-to-b from-white to-blue-50 border-2 border-primary/20"
         // <-- This hides the top-right close button (if supported by your dialog lib)
      >
        {/* <div className="relative w-24 h-24 flex items-center justify-center">
          {checkmarkVisible && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center animate-checkmark">
                <CircleCheck className="h-16 w-16 text-primary" />
              </div>
            </div>
          )}
        </div> */}

        {messageVisible && (
          <div className="space-y-3 animate-fade-in">
            <h2 className="text-2xl font-bold text-primary">You're in!</h2>
            <p className="text-base text-gray-600">
              Welcome to blazing-fast internet that <span className="text-primary font-semibold">#NeverSleeps</span>.
              <br />Expect smooth speeds and no drops — ever.
            </p>
          </div>
        )}

        {actionsVisible && (
          <div className="mt-6 flex flex-col sm:flex-row gap-3 animate-fade-in">
            
            {/* <Button 
              onClick={handleAddToCalendar} 
              variant="outline" 
              className="gap-2 border-primary/30 hover:bg-primary/5"
            >
              <Calendar size={18} />
              Add to Calendar
            </Button> */}
            <Button 
              onClick={handleShareReferral} 
              className="bg-primary hover:bg-primary/90 gap-2"
            >
              <Share size={18} />
              Share Referral
            </Button>
            
            <Button 
              onClick={onClose} // ✅ use the passed-in onClose handler
              className="bg-primary hover:bg-primary/90 gap-2"
            >
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;
