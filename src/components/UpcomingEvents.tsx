import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const SKETCHY_FONT = "'Cabin Sketch', sans-serif";
const BODY_FONT = "'Sora', sans-serif";

const RoughWavyUnderline = ({ className = "", strokeW = 2.5 }: { className?: string; strokeW?: number }) => (
  <svg className={className} viewBox="0 0 200 16" fill="none" aria-hidden="true">
    <path
      d="M2 10 C10 4, 20 4, 30 10 C40 16, 50 16, 60 10 C70 4, 80 4, 90 10 C100 16, 110 16, 120 10 C130 4, 140 4, 150 10 C160 16, 170 16, 180 10 C185 7, 190 6, 198 8"
      stroke="currentColor" strokeWidth={strokeW} fill="none" strokeLinecap="round"
    />
  </svg>
);

const TickedLine = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 120 12" preserveAspectRatio="none" fill="none" stroke="#090907" strokeWidth="1.2" strokeLinecap="round" aria-hidden="true">
    <path d="M0 6 Q30 5 60 6 Q90 7 120 6" />
    <path d="M12 6 v-2.5 M28 6 v2 M44 6 v-2 M60 6 v2 M76 6 v-2 M92 6 v2.5 M108 6 v-2" />
  </svg>
);

const HandDrawnRect = ({ fill = "white", stroke = "#090907", strokeWidth = 2, className = "" }: {
  fill?: string; stroke?: string; strokeWidth?: number; className?: string;
}) => (
  <svg className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden="true">
    <path
      d="M4,5 C15,3 35,6 60,4 C85,2 120,5 150,3 C175,5 190,3 196,5
         C198,12 197,25 198,35 C197,45 198,52 196,56
         C185,58 170,55 140,57 C110,59 80,55 50,57 C25,59 10,56 4,55
         C2,48 3,35 2,25 C3,15 2,8 4,5 Z"
      fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round"
    />
  </svg>
);

const HandDrawnRectTall = ({ fill = "white", stroke = "#090907", strokeWidth = 2, className = "" }: {
  fill?: string; stroke?: string; strokeWidth?: number; className?: string;
}) => (
  <svg className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} viewBox="0 0 100 200" preserveAspectRatio="none" aria-hidden="true">
    <path
      d="M3,4 C20,2 50,5 70,3 C85,4 95,3 97,5
         C99,20 97,50 98,80 C97,110 99,140 98,170 C97,185 99,195 97,197
         C80,199 50,196 30,198 C15,197 5,199 3,197
         C1,180 3,150 2,120 C3,90 1,60 2,30 C3,15 1,8 3,4 Z"
      fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round"
    />
  </svg>
);

const UpcomingEvents = ({ variant }: { variant?: 'default' | 'sketchy' }) => {
  const { data: events, isLoading, error } = useQuery({
    queryKey: ['upcoming-events'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('date', today)
        .order('date', { ascending: true })
        .limit(5);
      if (error) throw error;
      return data;
    }
  });

  return (
    <section
      className={`py-16 md:py-20 ${variant === 'sketchy' ? 'paper-bg' : 'bg-background'}`}
      style={variant === 'sketchy' ? { fontFamily: BODY_FONT } : undefined}
    >
      <div className="container mx-auto px-4">
        {variant === 'sketchy' ? (
          <div className="flex flex-col items-center mb-8">
            {/* Match Stitch / Two Ways: horizontal black lines with tick marks, black wavy underline under title */}
            <div className="flex items-center justify-center gap-4 md:gap-6 w-full max-w-3xl mx-auto">
              <TickedLine className="flex-1 h-3 min-w-[60px] max-w-[140px]" />
              <div className="flex flex-col items-center shrink-0">
                <h2 className="text-4xl md:text-5xl font-black text-[#090907] text-center whitespace-nowrap" style={{ fontFamily: SKETCHY_FONT }}>Upcoming Sessions</h2>
                <span className="block mt-1 text-[#090907] w-full">
                  <RoughWavyUnderline className="w-full h-3" strokeW={2.5} />
                </span>
              </div>
              <TickedLine className="flex-1 h-3 min-w-[60px] max-w-[140px]" />
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">Upcoming Sessions</h2>
              <p className="text-muted-foreground text-lg">Join a live session to experience the community.</p>
            </div>
            <a href="https://www.meetup.com/ux-support-group/" target="_blank" rel="noopener noreferrer"
              className="text-primary hover:underline font-medium flex items-center gap-2">View Full Calendar →</a>
          </div>
        )}

        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-20 w-full mb-4" />
                  <Skeleton className="h-8 w-20" />
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-destructive mb-4">Failed to load events</p>
              <Button size="lg" asChild>
                <a href="https://www.meetup.com/ux-support-group/" target="_blank" rel="noopener noreferrer">View All Events on Meetup.com →</a>
              </Button>
            </div>
          ) : events && events.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-5">
              {events.slice(0, 3).map((event, index) => {
                const eventDate = new Date(event.date + 'T00:00:00');
                const borderColors = ['border-t-blue-500', 'border-t-purple-500', 'border-t-green-500'];
                const timeColors = ['text-blue-600', 'text-purple-600', 'text-green-600'];
                return variant === 'sketchy' ? (
                  <div key={event.id} className="relative p-5 hover:shadow-lg transition-shadow">
                    <HandDrawnRectTall fill="white" stroke="#090907" strokeWidth={1.5} />
                    {/* Tape */}
                    <div className="absolute -top-1 left-4 w-12 h-4 bg-[#5a5a5a]/60 -rotate-6 z-20" style={{ filter: "url(#roughen)" }} aria-hidden />
                    <div className="absolute -bottom-1 right-4 w-12 h-4 bg-[#5a5a5a]/60 rotate-6 z-20" style={{ filter: "url(#roughen)" }} aria-hidden />
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="text-xs font-normal text-[#090907]/80 mb-2 tracking-wide" style={{ fontFamily: BODY_FONT }}>
                        {format(eventDate, 'EEE MMM d')}
                        {event.start_time && <> – {format(new Date(`2000-01-01T${event.start_time}:00`), 'h:mm a')} EST</>}
                      </div>
                      <h3 className="text-2xl font-black leading-tight text-[#090907] mb-auto" style={{ fontFamily: SKETCHY_FONT }}>{event.title}</h3>
                      <a href={event.meetup_link || 'https://www.meetup.com/ux-support-group/'} target="_blank" rel="noopener noreferrer"
                        className="relative inline-flex items-center justify-center self-start py-2 px-5 mt-6 text-sm rounded-full min-w-[100px]" style={{ fontFamily: BODY_FONT }}>
                        <span className="relative z-10 text-white font-bold">RSVP +</span>
                        <span className="absolute inset-0 rounded-full bg-[#e67e22] border-2 border-[#090907]" style={{ boxShadow: "2px 2px 0 #090907" }} aria-hidden />
                      </a>
                    </div>
                  </div>
                ) : (
                  <Card key={event.id} className={`relative overflow-hidden hover:shadow-lg transition-shadow border-t-4 ${borderColors[index % 3]}`}>
                    <div className="p-6">
                      <div className={`text-sm font-bold uppercase mb-3 ${timeColors[index % 3]}`}>
                        {format(eventDate, 'EEE MMM d')}
                        {event.start_time && <> &middot; {format(new Date(`2000-01-01T${event.start_time}:00`), 'h:mm a')} EST</>}
                      </div>
                      <h3 className="text-xl font-bold mb-3 leading-tight">{event.title}</h3>
                      {event.description && <p className="text-sm text-muted-foreground mb-6 line-clamp-3">{event.description}</p>}
                      <div className="mt-auto">
                        <Button asChild className="w-full">
                          <a href={event.meetup_link || 'https://www.meetup.com/ux-support-group/'} target="_blank" rel="noopener noreferrer">RSVP →</a>
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-xl text-muted-foreground mb-8">No upcoming events scheduled at the moment. Check back soon!</p>
              <Button size="lg" asChild>
                <a href="https://www.meetup.com/ux-support-group/" target="_blank" rel="noopener noreferrer">View All Events on Meetup.com →</a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
