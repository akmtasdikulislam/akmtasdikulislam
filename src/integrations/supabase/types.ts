export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      author_profile: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string | null
          github_url: string | null
          id: string
          linkedin_url: string | null
          name: string
          title: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          name?: string
          title?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          name?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          category: string
          content: string
          cover_image: string | null
          created_at: string
          excerpt: string
          featured: boolean | null
          id: string
          published_at: string | null
          read_time: number | null
          slug: string
          status: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          content: string
          cover_image?: string | null
          created_at?: string
          excerpt: string
          featured?: boolean | null
          id?: string
          published_at?: string | null
          read_time?: number | null
          slug: string
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string
          featured?: boolean | null
          id?: string
          published_at?: string | null
          read_time?: number | null
          slug?: string
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      certifications: {
        Row: {
          badge_image: string | null
          created_at: string
          credential_id: string | null
          credential_url: string | null
          description: string | null
          display_order: number | null
          expiry_date: string | null
          id: string
          issue_date: string
          issuer: string
          title: string
          updated_at: string
        }
        Insert: {
          badge_image?: string | null
          created_at?: string
          credential_id?: string | null
          credential_url?: string | null
          description?: string | null
          display_order?: number | null
          expiry_date?: string | null
          id?: string
          issue_date: string
          issuer: string
          title: string
          updated_at?: string
        }
        Update: {
          badge_image?: string | null
          created_at?: string
          credential_id?: string | null
          credential_url?: string | null
          description?: string | null
          display_order?: number | null
          expiry_date?: string | null
          id?: string
          issue_date: string
          issuer: string
          title: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          category: string
          created_at: string
          description: string
          featured: boolean | null
          gallery: string[] | null
          github_url: string | null
          id: string
          image: string | null
          live_url: string | null
          long_description: string | null
          slug: string
          status: string
          technologies: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description: string
          featured?: boolean | null
          gallery?: string[] | null
          github_url?: string | null
          id?: string
          image?: string | null
          live_url?: string | null
          long_description?: string | null
          slug: string
          status?: string
          technologies?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          featured?: boolean | null
          gallery?: string[] | null
          github_url?: string | null
          id?: string
          image?: string | null
          live_url?: string | null
          long_description?: string | null
          slug?: string
          status?: string
          technologies?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          company: string | null
          content: string
          created_at: string
          display_order: number | null
          id: string
          is_featured: boolean | null
          name: string
          position: string | null
          rating: number | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          content: string
          created_at?: string
          display_order?: number | null
          id?: string
          is_featured?: boolean | null
          name: string
          position?: string | null
          rating?: number | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          content?: string
          created_at?: string
          display_order?: number | null
          id?: string
          is_featured?: boolean | null
          name?: string
          position?: string | null
          rating?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      work_history: {
        Row: {
          company: string
          company_logo: string | null
          created_at: string
          description: string | null
          display_order: number | null
          end_date: string | null
          id: string
          is_current: boolean | null
          location: string | null
          position: string
          start_date: string
          technologies: string[] | null
          updated_at: string
        }
        Insert: {
          company: string
          company_logo?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          location?: string | null
          position: string
          start_date: string
          technologies?: string[] | null
          updated_at?: string
        }
        Update: {
          company?: string
          company_logo?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          location?: string | null
          position?: string
          start_date?: string
          technologies?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      homepage_hero: {
        Row: {
          id: string
          name: string
          greeting_badge: string
          description: string
          profile_photo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name?: string
          greeting_badge?: string
          description?: string
          profile_photo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          greeting_badge?: string
          description?: string
          profile_photo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      homepage_hero_roles: {
        Row: {
          id: string
          role_text: string
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          role_text?: string
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role_text?: string
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      homepage_hero_techs: {
        Row: {
          id: string
          name: string
          icon_url: string
          position_class: string
          animation_class: string
          delay: number
          invert: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name?: string
          icon_url?: string
          position_class?: string
          animation_class?: string
          delay?: number
          invert?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          icon_url?: string
          position_class?: string
          animation_class?: string
          delay?: number
          invert?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      homepage_hero_badges: {
        Row: {
          id: string
          badge_text: string
          position_class: string
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          badge_text?: string
          position_class?: string
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          badge_text?: string
          position_class?: string
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      homepage_hero_stats: {
        Row: {
          id: string
          stat_label: string
          stat_value: number
          stat_suffix: string
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          stat_label?: string
          stat_value?: number
          stat_suffix?: string
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          stat_label?: string
          stat_value?: number
          stat_suffix?: string
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      homepage_social_links: {
        Row: {
          id: string
          platform: string
          url: string
          icon_name: string | null
          icon_url: string | null
          display_order: number
          is_visible: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          platform?: string
          url?: string
          icon_name?: string | null
          icon_url?: string | null
          display_order?: number
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          platform?: string
          url?: string
          icon_name?: string | null
          icon_url?: string | null
          display_order?: number
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      homepage_navbar: {
        Row: {
          id: string
          logo_text: string
          logo_icon_name: string
          cta_button_text: string
          cta_button_href: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          logo_text?: string
          logo_icon_name?: string
          cta_button_text?: string
          cta_button_href?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          logo_text?: string
          logo_icon_name?: string
          cta_button_text?: string
          cta_button_href?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      homepage_nav_links: {
        Row: {
          id: string
          label: string
          href: string
          path: string
          display_order: number
          is_visible: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          label?: string
          href?: string
          path?: string
          display_order?: number
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          label?: string
          href?: string
          path?: string
          display_order?: number
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      homepage_about: {
        Row: {
          id: string
          section_badge: string
          section_title: string
          section_highlight: string
          section_description: string
          paragraph_1: string
          paragraph_2: string
          paragraph_3: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          section_badge?: string
          section_title?: string
          section_highlight?: string
          section_description?: string
          paragraph_1?: string
          paragraph_2?: string
          paragraph_3?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          section_badge?: string
          section_title?: string
          section_highlight?: string
          section_description?: string
          paragraph_1?: string
          paragraph_2?: string
          paragraph_3?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      homepage_about_highlights: {
        Row: {
          id: string
          icon_name: string
          title: string
          description: string
          detail: string
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          icon_name?: string
          title?: string
          description?: string
          detail?: string
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          icon_name?: string
          title?: string
          description?: string
          detail?: string
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      homepage_about_interests: {
        Row: {
          id: string
          icon_name: string
          label: string
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          icon_name?: string
          label?: string
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          icon_name?: string
          label?: string
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      homepage_about_values: {
        Row: {
          id: string
          icon_name: string
          value_text: string
          description: string
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          icon_name?: string
          value_text?: string
          description?: string
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          icon_name?: string
          value_text?: string
          description?: string
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      homepage_footer: {
        Row: {
          id: string
          logo_text: string
          description: string
          contact_email: string
          copyright_text: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          logo_text?: string
          description?: string
          contact_email?: string
          copyright_text?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          logo_text?: string
          description?: string
          contact_email?: string
          copyright_text?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      homepage_expertise_techs: {
        Row: {
          id: string
          name: string
          icon_url: string | null
          category: string
          is_marquee: boolean | null
          in_expertise_grid: boolean | null
          display_order: number | null
          invert_icon: boolean | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          icon_url?: string | null
          category: string
          is_marquee?: boolean | null
          in_expertise_grid?: boolean | null
          display_order?: number | null
          invert_icon?: boolean | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          icon_url?: string | null
          category?: string
          is_marquee?: boolean | null
          in_expertise_grid?: boolean | null
          display_order?: number | null
          invert_icon?: boolean | null
          created_at?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      homepage_expertise_cards: {
        Row: {
          id: string
          title: string
          description: string | null
          icon_url: string | null
          display_order: number | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          icon_url?: string | null
          display_order?: number | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          icon_url?: string | null
          display_order?: number | null
          created_at?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      homepage_services: {
        Row: {
            id: string
            title: string
            description: string | null
            icon_name: string | null
            features: string[] | null
            display_order: number | null
            created_at: string
            updated_at: string | null
        }
        Insert: {
            id?: string
            title: string
            description?: string | null
            icon_name?: string | null
            features?: string[] | null
            display_order?: number | null
            created_at?: string
            updated_at?: string | null
        }
        Update: {
            id?: string
            title?: string
            description?: string | null
            icon_name?: string | null
            features?: string[] | null
            display_order?: number | null
            created_at?: string
            updated_at?: string | null
        }
        Relationships: []
      }
      homepage_testimonials: {
        Row: {
            id: string
            name: string
            role: string | null
            content: string
            avatar_url: string | null
            rating: number | null
            display_order: number | null
            is_visible: boolean | null
            created_at: string
            updated_at: string | null
        }
        Insert: {
            id?: string
            name: string
            role?: string | null
            content: string
            avatar_url?: string | null
            rating?: number | null
            display_order?: number | null
            is_visible?: boolean | null
            created_at?: string
            updated_at?: string | null
        }
        Update: {
            id?: string
            name?: string
            role?: string | null
            content?: string
            avatar_url?: string | null
            rating?: number | null
            display_order?: number | null
            is_visible?: boolean | null
            created_at?: string
            updated_at?: string | null
        }
        Relationships: []
      }
      homepage_coding_profiles: {
        Row: {
            id: string
            platform: string
            url: string
            icon_url: string | null
            display_order: number | null
            created_at: string
            updated_at: string | null
        }
        Insert: {
            id?: string
            platform: string
            url: string
            icon_url?: string | null
            display_order?: number | null
            created_at?: string
            updated_at?: string | null
        }
        Update: {
            id?: string
            platform?: string
            url?: string
            icon_url?: string | null
            display_order?: number | null
            created_at?: string
            updated_at?: string | null
        }
        Relationships: []
      }
      homepage_contact_info: {
        Row: {
            id: string
            email: string | null
            location: string | null
            location_url: string | null
            available_for_work: boolean | null
            available_text: string | null
            created_at: string
            updated_at: string | null
        }
        Insert: {
            id?: string
            email?: string | null
            location?: string | null
            location_url?: string | null
            available_for_work?: boolean | null
            available_text?: string | null
            created_at?: string
            updated_at?: string | null
        }
        Update: {
            id?: string
            email?: string | null
            location?: string | null
            location_url?: string | null
            available_for_work?: boolean | null
            available_text?: string | null
            created_at?: string
            updated_at?: string | null
        }
        Relationships: []
      }
      homepage_general: {
        Row: {
          id: string
          site_title: string
          site_description: string
          site_keywords: string[] | null
          favicon_url: string | null
          og_image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          site_title?: string
          site_description?: string
          site_keywords?: string[] | null
          favicon_url?: string | null
          og_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          site_title?: string
          site_description?: string
          site_keywords?: string[] | null
          favicon_url?: string | null
          og_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor", "user"],
    },
  },
} as const
