export interface RailwaySign {
  id: number;
  name: string;
  category: string;
  color: string;
  description: string;
  safetyInstruction: string;
}

export const railwaySigns: RailwaySign[] = [
  { id: 1, name: "Stop", category: "Mandatory", color: "#DC2626", description: "Indicates that all trains must come to a complete stop at this point before proceeding.", safetyInstruction: "All trains must stop completely. Do not proceed until clearance is given by the signalman or automated system." },
  { id: 2, name: "Speed Limit", category: "Regulatory", color: "#EA580C", description: "Indicates the maximum speed permitted for trains at this location.", safetyInstruction: "Reduce speed to the indicated limit immediately. Exceeding the speed limit can cause derailment or collision." },
  { id: 3, name: "Railway Crossing", category: "Warning", color: "#CA8A04", description: "Marks a location where a road crosses the railway track at grade level.", safetyInstruction: "Activate warning systems. Sound horn. Proceed only after confirming the crossing is clear." },
  { id: 4, name: "Whistle", category: "Mandatory", color: "#2563EB", description: "Requires the train driver to sound the horn/whistle upon passing this sign.", safetyInstruction: "Sound the train horn immediately when passing this sign. This alerts track workers and pedestrians." },
  { id: 5, name: "Caution", category: "Warning", color: "#CA8A04", description: "General warning sign indicating a hazard ahead that requires reduced speed and heightened alertness.", safetyInstruction: "Reduce speed and increase alertness. Be prepared to stop. Watch for workers, equipment, or obstacles on the track." },
  { id: 6, name: "Signal Ahead", category: "Informational", color: "#059669", description: "Indicates that a signal post is located ahead. Drivers should prepare to observe and respond to signal aspects.", safetyInstruction: "Prepare to observe the signal ahead. Be ready to stop if the signal shows danger. Do not pass a red signal." },
  { id: 7, name: "Danger Zone", category: "Prohibition", color: "#DC2626", description: "Marks an area with extreme hazard. No unauthorized personnel should enter this zone.", safetyInstruction: "Do not enter without authorization. Ensure all safety protocols are followed. Wear required PPE at all times." },
  { id: 8, name: "Track Maintenance", category: "Informational", color: "#7C3AED", description: "Indicates that track maintenance work is ongoing or scheduled in the vicinity.", safetyInstruction: "Reduce speed significantly. Watch for track workers and maintenance equipment. Follow hand signals from track maintenance personnel." },
  { id: 9, name: "No Entry", category: "Prohibition", color: "#DC2626", description: "Prohibits trains from entering a section of track, typically because it is occupied or under maintenance.", safetyInstruction: "Do not enter this section of track under any circumstances. Contact the control center before proceeding." },
  { id: 10, name: "Level Crossing", category: "Warning", color: "#CA8A04", description: "Marks a level crossing ahead where road vehicles may be crossing the railway.", safetyInstruction: "Approach at reduced speed. Activate crossing signals and gates if not automatic. Sound horn before crossing." },
  { id: 11, name: "Platform Ahead", category: "Informational", color: "#0284C7", description: "Indicates that a passenger platform is ahead. Trains should prepare for stopping.", safetyInstruction: "Prepare to stop at the platform. Reduce speed according to timetable requirements. Ensure alignment with platform edge." },
  { id: 12, name: "Tunnel Ahead", category: "Warning", color: "#374151", description: "Warns that a tunnel is ahead. Drivers should check clearance and prepare for reduced visibility.", safetyInstruction: "Ensure all lights are operational. Check tunnel clearance. Sound horn before entering. Reduce speed if required." },
  { id: 13, name: "Bridge Ahead", category: "Warning", color: "#0D9488", description: "Indicates a railway bridge ahead. Speed restrictions may apply based on bridge load capacity.", safetyInstruction: "Observe speed restrictions for the bridge. Do not exceed weight limits. Report any structural concerns immediately." },
  { id: 14, name: "Slow Down", category: "Regulatory", color: "#EA580C", description: "Requires the train to reduce its speed immediately due to track conditions or upcoming hazards.", safetyInstruction: "Reduce speed immediately. Do not return to normal speed until a Resume Speed sign is observed." },
  { id: 15, name: "Warning Signal", category: "Warning", color: "#CA8A04", description: "A general warning signal indicating potential danger. Requires immediate attention from the train driver.", safetyInstruction: "Stop if necessary. Assess the situation before proceeding. Contact control center for guidance if the warning persists." },
];
