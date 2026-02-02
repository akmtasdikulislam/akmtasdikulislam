import { supabase } from "./client";

export async function getSectionHeadings() {
  const { data, error } = await supabase
    .from("homepage_section_headings")
    .select("*");
  if (error) throw error;
  return data;
}

export async function getSectionHeading(sectionKey: string) {
  const { data, error } = await supabase
    .from("homepage_section_headings")
    .select("*")
    .eq("section_key", sectionKey)
    .single();
  if (error) throw error;
  return data;
}

export async function updateSectionHeading(heading: any) {
  const { data, error } = await supabase
    .from("homepage_section_headings")
    .update({
      section_badge: heading.section_badge,
      section_title: heading.section_title,
      section_highlight: heading.section_highlight,
      section_description: heading.section_description
    })
    .eq("section_key", heading.section_key)
    .select()
    .single();
  if (error) throw error;
  return data;
}
