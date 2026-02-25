// deno-lint-ignore-file
// @ts-nocheck
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const validatePayload = (payload: ContactPayload) => {
  if (!payload?.name || !payload?.email || !payload?.subject || !payload?.message) {
    throw new Error("All fields are required.");
  }
  const email = payload.email.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Please enter a valid email address.");
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as ContactPayload;
    validatePayload(body);

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceKey) {
      throw new Error("Missing Supabase environment configuration.");
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    });

    const messagePayload = {
      name: body.name.trim(),
      email: body.email.trim(),
      subject: body.subject.trim(),
      message: body.message.trim(),
    };

    const { error: insertError } = await supabase
      .from("contact_messages")
      .insert([messagePayload]);

    if (insertError) {
      throw insertError;
    }

    const { data: contactInfo, error: infoError } = await supabase
      .from("homepage_contact_info")
      .select("notification_email, notify_on_message")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (infoError) {
      throw infoError;
    }

    if (contactInfo?.notify_on_message && contactInfo?.notification_email) {
      const resendKey = Deno.env.get("RESEND_API_KEY");
      const fromEmail = Deno.env.get("RESEND_FROM_EMAIL") || "Portfolio Contact <no-reply@resend.dev>";

      if (resendKey) {
        const emailPayload = {
          from: fromEmail,
          to: [contactInfo.notification_email],
          subject: `New contact message: ${messagePayload.subject}`,
          text: [
            "You received a new contact message.",
            "",
            `Name: ${messagePayload.name}`,
            `Email: ${messagePayload.email}`,
            `Subject: ${messagePayload.subject}`,
            "",
            messagePayload.message,
          ].join("\n"),
        };

        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(emailPayload),
        });
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
