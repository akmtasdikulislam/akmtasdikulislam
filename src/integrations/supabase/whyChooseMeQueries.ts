import { supabase } from "./client";

export async function getWhyChooseContent() {
  const { data, error } = await supabase
    .from("homepage_why_choose")
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function getWhyChooseReasons() {
  const { data, error } = await supabase
    .from("homepage_why_choose_reasons")
    .select("*")
    .order("display_order", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getWhyChooseStats() {
  const { data, error } = await supabase
    .from("homepage_why_choose_stats")
    .select("*")
    .order("display_order", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getAllWhyChooseData() {
  const [content, reasons, stats] = await Promise.all([
    getWhyChooseContent(),
    getWhyChooseReasons(),
    getWhyChooseStats(),
  ]);
  return { content, reasons, stats };
}

export async function updateWhyChooseContent(content: any) {
  const { data, error } = await supabase
    .from("homepage_why_choose")
    .update(content)
    .eq("id", content.id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateWhyChooseReason(reason: any) {
  const { data, error } = await supabase
    .from("homepage_why_choose_reasons")
    .update(reason)
    .eq("id", reason.id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function createWhyChooseReason(reason: any) {
  const { data, error } = await supabase
    .from("homepage_why_choose_reasons")
    .insert(reason)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteWhyChooseReason(id: string) {
  const { error } = await supabase
    .from("homepage_why_choose_reasons")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function updateWhyChooseStat(stat: any) {
  const { data, error } = await supabase
    .from("homepage_why_choose_stats")
    .update(stat)
    .eq("id", stat.id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function createWhyChooseStat(stat: any) {
  const { data, error } = await supabase
    .from("homepage_why_choose_stats")
    .insert(stat)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteWhyChooseStat(id: string) {
  const { error } = await supabase
    .from("homepage_why_choose_stats")
    .delete()
    .eq("id", id);
  if (error) throw error;
}
