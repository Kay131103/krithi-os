export type AchievementDef = {
  id: string;
  name: string;
  description: string;
  hint: string;
};

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "curious_humans",
    name: "Curious Humans",
    description: "Opened 3 of the four curiosity folders",
    hint: "open 3 of: my_brain, experiments, outside_the_terminal, unnecessary_thoughts",
  },
  {
    id: "certified_overthinker",
    name: "Certified Overthinker",
    description: "Viewed 6 different tabs in 37_tabs_open",
    hint: "6 unique tabs in the simulated browser",
  },
  {
    id: "bug_hunter",
    name: "Bug Hunter",
    description: "Followed all 4 stages of The Two-Minute Problem",
    hint: "investigate the case in bugs_i_fixed",
  },
  {
    id: "terminally_curious",
    name: "Terminally Curious",
    description: "Ran 3 valid terminal commands",
    hint: "terminal.exe is right there",
  },
  {
    id: "beyond_keyboard",
    name: "Beyond Keyboard",
    description: "Opened the hidden file in outside_the_terminal",
    hint: "the hidden files card isn't hiding well",
  },
  {
    id: "chaos_engineer",
    name: "Chaos Engineer",
    description: "Triggered a slider combination mode",
    hint: "personality_settings.exe · push sliders until the OS objects",
  },
  {
    id: "no_stone_unturned",
    name: "No Stone Unturned",
    description: "Found all 11 easter eggs",
    hint: "11 eggs. some are hiding in the furniture.",
  },
];

export const EGGS: { id: string; label: string }[] = [
  { id: "egg_boot_404", label: "egg_boot_404" },
  { id: "egg_doodle_star", label: "egg_doodle_star" },
  { id: "egg_sax_file", label: "egg_sax_file" },
  { id: "egg_recycle_secret", label: "egg_recycle_secret" },
  { id: "egg_terminal_coffee", label: "egg_terminal_coffee" },
  { id: "egg_hidden_tab", label: "egg_hidden_tab" },
  { id: "egg_clock_watcher", label: "egg_clock_watcher" },
  { id: "egg_paper_trail", label: "egg_paper_trail" },
  { id: "egg_logo_poker", label: "egg_logo_poker" },
  { id: "egg_wallpaper_cleaner", label: "egg_wallpaper_cleaner" },
  { id: "egg_secret_knock", label: "egg_secret_knock" },
  { id: "egg_konami_dev", label: "egg_konami_dev" },
  { id: "egg_right_click_new_folder", label: "egg_right_click_new_folder" },
];
