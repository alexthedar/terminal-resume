export interface NavOption {
  id: string;
  label: string;
  description: string;
}

export interface ResumeSection {
  id: string;
  title: string;
  content: string;
  navOptions: NavOption[];
}

export interface ResumeData {
  name: string;
  title: string;
  tagline: string;
  sections: Record<string, ResumeSection>;
}
