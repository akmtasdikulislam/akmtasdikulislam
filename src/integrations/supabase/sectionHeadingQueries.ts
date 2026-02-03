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
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateSectionHeading(heading: any) {
  const { data, error } = await supabase
    .from("homepage_section_headings")
    .upsert({
      section_key: heading.section_key,
      section_badge: heading.section_badge,
      section_title: heading.section_title,
      section_highlight: heading.section_highlight,
      section_description: heading.section_description
    }, { onConflict: 'section_key' })
    .select()
    .single();
  if (error) throw error;
  return data;
}
