import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Play } from "lucide-react";

const PastEvents = () => {
  const { data: events, isLoading, error } = useQuery({
    queryKey: ['past-events'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .lt('date', today)
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Past Events & Recordings</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <Skeleton className="h-10 w-full" />
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !events || events.length === 0) {
    return null; // Don't show section if no past events
  }

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Past Events & Recordings</h2>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="p-6 hover:shadow-lg transition-shadow border-muted">
                <div className="flex items-start gap-2 mb-2">
                  <h3 className="text-xl font-bold flex-1">{event.title}</h3>
                  <Play className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                </div>
                <p className="text-muted-foreground mb-1">
                  {format(new Date(event.date), 'MMMM d, yyyy')}
                </p>
                {event.start_time && (
                  <p className="text-sm text-muted-foreground mb-1">{event.start_time}</p>
                )}
                {event.location && (
                  <p className="text-sm text-muted-foreground mb-3">{event.location}</p>
                )}
                {event.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {event.description}
                  </p>
                )}
                {event.meetup_link && (
                  <Button variant="secondary" className="w-full" asChild>
                    <a href={event.meetup_link} target="_blank" rel="noopener noreferrer">
                      <Play className="h-4 w-4 mr-2" />
                      Watch Recording
                    </a>
                  </Button>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PastEvents;
