export const chapters = [
  {
    id: 1, title: "The First Reset", subtitle: "A body. A locked door. Five minutes to midnight.",
    briefing: "2099. Detective Mara Vale enters Chronos Research after an emergency signal. Dr. Adrian Voss is dead, and the facility's reactor is counting down. Find the first clue before the loop resets.",
    location: "Arrival Hall", duration: 180, requiredClues: ["bloodstained_access_card", "broken_watch"],
    clues: [
      { id: "bloodstained_access_card", name: "Bloodstained Access Card", detail: "A security card marked with the initials E.K. The blood is still wet.", location: "Reception desk" },
      { id: "broken_watch", name: "Broken Watch", detail: "The watch stopped at 23:47, thirteen minutes before the reset.", location: "Dr. Voss's body" }
    ],
    puzzle: { id: "arrival_code", title: "The Watch Code", prompt: "The watch stopped at 23:47. Enter the four digits shown by the stopped time (HHMM).", answer: "2347", hint: "Use the hour followed by the minutes.", success: "The emergency archive unlocks. A camera feed shows someone entering at 23:47." }
  },
  {
    id: 2, title: "The Missing Footage", subtitle: "Someone erased exactly seven minutes.",
    briefing: "The security archive has been wiped. Recover the missing camera segment and identify who entered the laboratory.",
    location: "Security Control", duration: 180, requiredClues: ["camera_frame_ek", "deleted_log"],
    clues: [
      { id: "camera_frame_ek", name: "Blurred Camera Frame", detail: "A figure wearing an E.K. access badge appears outside the lab.", location: "Monitor 04" },
      { id: "deleted_log", name: "Deletion Log", detail: "Footage was deleted using terminal 03 at 23:41.", location: "Security terminal" }
    ],
    puzzle: { id: "camera_sequence", title: "Restore the Camera Feed", prompt: "The archive key is the terminal number followed by the deletion minute: terminal 03, minute 41.", answer: "0341", hint: "Combine the terminal number and minute as four digits.", success: "The footage restores. Elena Kade is seen carrying a small metal case." }
  },
  {
    id: 3, title: "The Locked Memory", subtitle: "A message buried in the scientist's files.",
    briefing: "Dr. Voss encrypted a message before his death. The password is hidden in the lab's research notes.",
    location: "Data Archive", duration: 180, requiredClues: ["voss_note", "encrypted_message"],
    clues: [
      { id: "voss_note", name: "Research Note", detail: "The note reads: 'The experiment began in 2086. Remember the year.'", location: "Desk drawer" },
      { id: "encrypted_message", name: "Encrypted Message", detail: "A file titled LOOP_ORIGIN requires a four-digit key.", location: "Archive terminal" }
    ],
    puzzle: { id: "memory_key", title: "Unlock LOOP_ORIGIN", prompt: "Enter the year the experiment began.", answer: "2086", hint: "Read Dr. Voss's research note.", success: "The message reads: 'The first loop was not an accident. Someone activated it deliberately.'" }
  },
  {
    id: 4, title: "The Hidden Laboratory", subtitle: "The experiment beneath the experiment.",
    briefing: "A hidden elevator leads below the facility. The power grid is offline and the lab door needs a circuit sequence.",
    location: "Sublevel 9", duration: 180, requiredClues: ["chronos_blueprint", "power_cell"],
    clues: [
      { id: "chronos_blueprint", name: "Chronos Blueprint", detail: "A schematic shows the power cells arranged in a triangular pattern.", location: "Blueprint cabinet" },
      { id: "power_cell", name: "Unstable Power Cell", detail: "A cell stamped with the sequence 3-1-4-2.", location: "Maintenance cart" }
    ],
    puzzle: { id: "power_sequence", title: "Power the Lift", prompt: "Enter the power-cell sequence exactly as printed (use four digits).", answer: "3142", hint: "The sequence is stamped on the unstable power cell.", success: "The lift descends. A second control room appears below the laboratory." }
  },
  {
    id: 5, title: "The First Timeline", subtitle: "The past is a room you can enter.",
    briefing: "The Chronos device opens a brief window into 23:41, before the murder. Change one event and observe the consequence.",
    location: "Temporal Chamber", duration: 180, requiredClues: ["temporal_recording", "keycard_copy"],
    clues: [
      { id: "temporal_recording", name: "Temporal Recording", detail: "A recording captures Voss saying: 'Do not let Kade reach the west wing.'", location: "Chronos console" },
      { id: "keycard_copy", name: "Duplicate Keycard", detail: "A copied card can open the west-wing door in the earlier timeline.", location: "Fabricator" }
    ],
    puzzle: { id: "timeline_offset", title: "Set the Temporal Offset", prompt: "The console says: 'Return to the minute the footage was deleted.' Enter the four-digit time.", answer: "2341", hint: "The deletion log gives the time as 23:41.", success: "You enter the earlier timeline. The west-wing door can now be secured before Kade arrives." }
  },
  {
    id: 6, title: "Four Suspects", subtitle: "Every story changes when time repeats.",
    briefing: "Four people had access to the Chronos project: Elena Kade, Dr. Soren, security chief Malik and assistant June. Compare their alibis.",
    location: "Interrogation Suite", duration: 180, requiredClues: ["kade_alibi", "soren_transcript"],
    clues: [
      { id: "kade_alibi", name: "Kade's Contradictory Alibi", detail: "Kade claims she was in the east wing, but the access log places her in the west wing.", location: "Interview terminal" },
      { id: "soren_transcript", name: "Soren's Transcript", detail: "Soren says Voss planned to shut the experiment down at midnight.", location: "Audio archive" }
    ],
    puzzle: { id: "suspect_logic", title: "Identify the Contradiction", prompt: "Which suspect's alibi conflicts with the access log? Enter KADE, SOREN, MALIK or JUNE.", answer: "KADE", hint: "Compare the claimed east-wing location with the west-wing access record.", success: "Kade's statement is flagged as false. But a false alibi does not prove murder." }
  },
  {
    id: 7, title: "The Parallel Reality", subtitle: "A version of the facility where Voss survived.",
    briefing: "The timeline branches. In this reality, Voss is alive, but he does not recognize the investigators. Find what changed.",
    location: "Mirror Facility", duration: 180, requiredClues: ["mirror_photo", "alternate_log"],
    clues: [
      { id: "mirror_photo", name: "Photograph from Another Reality", detail: "The photo shows Voss with Malik, standing beside a powered-down Chronos machine.", location: "Break room" },
      { id: "alternate_log", name: "Alternate Access Log", detail: "In this reality, Malik entered the temporal chamber at 23:39.", location: "Mirror terminal" }
    ],
    puzzle: { id: "mirror_year", title: "Find the Branch Year", prompt: "The photograph is dated 2089. Enter the year to synchronize the branch.", answer: "2089", hint: "Read the date on the alternate-reality photograph.", success: "The realities align. Malik had access to the machine before the murder." }
  },
  {
    id: 8, title: "The Paradox", subtitle: "The clue you erase is the clue you need.",
    briefing: "A paradox has corrupted the reactor controls. Use a remembered clue from an earlier loop to stabilize the machine.",
    location: "Reactor Core", duration: 180, requiredClues: ["reactor_equation", "voss_voiceprint"],
    clues: [
      { id: "reactor_equation", name: "Reactor Equation", detail: "The stabilizer requires the sequence 8-1-6-3.", location: "Reactor panel" },
      { id: "voss_voiceprint", name: "Voss Voiceprint", detail: "Voss says: 'The safe sequence is the year minus the first two digits, then the final digit.'", location: "Emergency recorder" }
    ],
    puzzle: { id: "paradox_sequence", title: "Stabilize the Reactor", prompt: "Enter the stabilizer sequence printed on the reactor equation.", answer: "8163", hint: "The equation is on the reactor panel.", success: "The reactor stabilizes. The loop is being maintained from outside the facility." }
  },
  {
    id: 9, title: "The Last Witness", subtitle: "The person who remembers every reset.",
    briefing: "A witness appears in every timeline, always near the Chronos machine. Find their identity and motive.",
    location: "Observation Deck", duration: 180, requiredClues: ["witness_badge", "founder_record"],
    clues: [
      { id: "witness_badge", name: "Founder Badge", detail: "The badge belongs to project founder Dr. Soren Vale, presumed dead for thirteen years.", location: "Observation deck" },
      { id: "founder_record", name: "Founder Recording", detail: "The founder admits he has been preserving the loop to prevent a catastrophe outside the facility.", location: "Private archive" }
    ],
    puzzle: { id: "witness_identity", title: "Name the Witness", prompt: "Enter the surname of the project founder.", answer: "VALE", hint: "The founder badge identifies Dr. Soren Vale.", success: "The witness is the founder. He has been manipulating the loop to contain a future disaster." }
  },
  {
    id: 10, title: "The Last Timeline", subtitle: "End the loop. Choose what survives.",
    briefing: "The investigators reach the final control chamber. The loop can be ended, but every option has a cost. Decide the fate of the timeline together.",
    location: "Chronos Core", duration: 240, requiredClues: ["founder_badge", "origin_core"],
    clues: [
      { id: "founder_badge", name: "Founder Badge", detail: "The founder's identity is confirmed: Soren Vale.", location: "Final console" },
      { id: "origin_core", name: "Origin Core", detail: "The core contains the original timeline seed. It can be destroyed, preserved or transferred.", location: "Chronos reactor" }
    ],
    puzzle: { id: "origin_code", title: "Unlock the Origin Core", prompt: "The original experiment began in 2086. Enter its origin year.", answer: "2086", hint: "The same year appears in Dr. Voss's first research note.", success: "The Origin Core unlocks. The team must now vote on the final timeline." },
    choices: [
      { id: "destroy", label: "Destroy the Core", description: "Break the loop permanently. The contained future catastrophe may return." },
      { id: "sacrifice", label: "One Stays Behind", description: "A player remains in the loop to keep the catastrophe contained." },
      { id: "preserve", label: "Preserve the Loop", description: "Keep the loop running and protect the outside world, at a terrible cost." }
    ]
  }
];
