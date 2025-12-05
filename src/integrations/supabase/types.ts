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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      contact_inquiries: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
        }
        Relationships: []
      }
      email_subscriptions: {
        Row: {
          email: string
          id: string
          is_active: boolean
          subscribed_at: string
        }
        Insert: {
          email: string
          id?: string
          is_active?: boolean
          subscribed_at?: string
        }
        Update: {
          email?: string
          id?: string
          is_active?: boolean
          subscribed_at?: string
        }
        Relationships: []
      }
      enrichments: {
        Row: {
          created_at: string
          display_order: number
          id: string
          image_url: string | null
          thumbnail_url: string | null
          title: string | null
          type: string
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string | null
          thumbnail_url?: string | null
          title?: string | null
          type: string
          url: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string | null
          thumbnail_url?: string | null
          title?: string | null
          type?: string
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrichments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrichments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string | null
          date: string
          description: string | null
          id: string
          location: string | null
          meetup_link: string | null
          start_time: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          description?: string | null
          id?: string
          location?: string | null
          meetup_link?: string | null
          start_time?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          location?: string | null
          meetup_link?: string | null
          start_time?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      magic_link_tokens: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          token: string
          used_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          expires_at: string
          token: string
          used_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          token?: string
          used_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "magic_link_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "magic_link_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsorship_inquiries: {
        Row: {
          company: string
          created_at: string
          email: string
          id: string
          message: string
          name: string
          notes: string | null
          package_interest: string
          status: string
        }
        Insert: {
          company: string
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          notes?: string | null
          package_interest: string
          status?: string
        }
        Update: {
          company?: string
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          notes?: string | null
          package_interest?: string
          status?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          bio: string | null
          card_screenshot_url: string | null
          company_name: string | null
          created_at: string
          email: string
          id: string
          job_title: string | null
          linkedin_url: string | null
          name: string | null
          profile_photo_url: string | null
          screenshot_generated_at: string | null
          screenshot_version: number | null
          slug: string | null
          updated_at: string
          wall_position_x: number | null
          wall_position_y: number | null
        }
        Insert: {
          bio?: string | null
          card_screenshot_url?: string | null
          company_name?: string | null
          created_at?: string
          email: string
          id?: string
          job_title?: string | null
          linkedin_url?: string | null
          name?: string | null
          profile_photo_url?: string | null
          screenshot_generated_at?: string | null
          screenshot_version?: number | null
          slug?: string | null
          updated_at?: string
          wall_position_x?: number | null
          wall_position_y?: number | null
        }
        Update: {
          bio?: string | null
          card_screenshot_url?: string | null
          company_name?: string | null
          created_at?: string
          email?: string
          id?: string
          job_title?: string | null
          linkedin_url?: string | null
          name?: string | null
          profile_photo_url?: string | null
          screenshot_generated_at?: string | null
          screenshot_version?: number | null
          slug?: string | null
          updated_at?: string
          wall_position_x?: number | null
          wall_position_y?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      user_profiles_public: {
        Row: {
          bio: string | null
          card_screenshot_url: string | null
          company_name: string | null
          created_at: string | null
          id: string | null
          job_title: string | null
          linkedin_url: string | null
          name: string | null
          profile_photo_url: string | null
          screenshot_generated_at: string | null
          screenshot_version: number | null
          slug: string | null
          updated_at: string | null
          wall_position_x: number | null
          wall_position_y: number | null
        }
        Insert: {
          bio?: string | null
          card_screenshot_url?: string | null
          company_name?: string | null
          created_at?: string | null
          id?: string | null
          job_title?: string | null
          linkedin_url?: string | null
          name?: string | null
          profile_photo_url?: string | null
          screenshot_generated_at?: string | null
          screenshot_version?: number | null
          slug?: string | null
          updated_at?: string | null
          wall_position_x?: number | null
          wall_position_y?: number | null
        }
        Update: {
          bio?: string | null
          card_screenshot_url?: string | null
          company_name?: string | null
          created_at?: string | null
          id?: string | null
          job_title?: string | null
          linkedin_url?: string | null
          name?: string | null
          profile_photo_url?: string | null
          screenshot_generated_at?: string | null
          screenshot_version?: number | null
          slug?: string | null
          updated_at?: string | null
          wall_position_x?: number | null
          wall_position_y?: number | null
        }
        Relationships: []
      }
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
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
