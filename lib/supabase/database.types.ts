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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          detail: Json | null
          id: string
          target_id: string | null
          target_table: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          detail?: Json | null
          id?: string
          target_id?: string | null
          target_table?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          detail?: Json | null
          id?: string
          target_id?: string | null
          target_table?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          cover_url: string | null
          created_at: string
          currency: string
          display_name: string | null
          display_unit: string | null
          id: string
          location: string | null
          skill_level: string | null
          updated_at: string
          username: string
          years_crocheting: number | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          cover_url?: string | null
          created_at?: string
          currency?: string
          display_name?: string | null
          display_unit?: string | null
          id: string
          location?: string | null
          skill_level?: string | null
          updated_at?: string
          username: string
          years_crocheting?: number | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          cover_url?: string | null
          created_at?: string
          currency?: string
          display_name?: string | null
          display_unit?: string | null
          id?: string
          location?: string | null
          skill_level?: string | null
          updated_at?: string
          username?: string
          years_crocheting?: number | null
        }
        Relationships: []
      }
      project_images: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          project_id: string
          sort_order: number
          storage_path: string
          taken_at: string
          user_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          project_id: string
          sort_order?: number
          storage_path: string
          taken_at?: string
          user_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          project_id?: string
          sort_order?: number
          storage_path?: string
          taken_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_images_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_images_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_materials: {
        Row: {
          color_name: string
          created_at: string
          id: string
          project_id: string
          required_grams: number
          reserved_grams: number
          user_id: string
          weight_class: string | null
          yarn_stash_id: string | null
        }
        Insert: {
          color_name: string
          created_at?: string
          id?: string
          project_id: string
          required_grams?: number
          reserved_grams?: number
          user_id: string
          weight_class?: string | null
          yarn_stash_id?: string | null
        }
        Update: {
          color_name?: string
          created_at?: string
          id?: string
          project_id?: string
          required_grams?: number
          reserved_grams?: number
          user_id?: string
          weight_class?: string | null
          yarn_stash_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_materials_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_materials_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_materials_yarn_stash_id_fkey"
            columns: ["yarn_stash_id"]
            isOneToOne: false
            referencedRelation: "yarn_stash"
            referencedColumns: ["id"]
          },
        ]
      }
      project_pieces: {
        Row: {
          created_at: string
          id: string
          is_complete: boolean
          name: string
          project_id: string
          sort_order: number
          squares_completed: number
          squares_required: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_complete?: boolean
          name: string
          project_id: string
          sort_order?: number
          squares_completed?: number
          squares_required?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_complete?: boolean
          name?: string
          project_id?: string
          sort_order?: number
          squares_completed?: number
          squares_required?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_pieces_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_pieces_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_progress: {
        Row: {
          completed_squares: number | null
          created_at: string
          id: string
          note: string | null
          photo_url: string | null
          project_id: string
          user_id: string
        }
        Insert: {
          completed_squares?: number | null
          created_at?: string
          id?: string
          note?: string | null
          photo_url?: string | null
          project_id: string
          user_id: string
        }
        Update: {
          completed_squares?: number | null
          created_at?: string
          id?: string
          note?: string | null
          photo_url?: string | null
          project_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_progress_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          calculator_input: Json | null
          calculator_result: Json | null
          colors: string[] | null
          completed_squares: number
          cover_image_url: string | null
          created_at: string
          currency: string
          deleted_at: string | null
          description: string | null
          difficulty: string | null
          estimated_cost_minor: number | null
          estimated_time_hours: number | null
          hook_size_mm: number | null
          id: string
          name: string
          notes: string | null
          size: string | null
          square_size_cm: number | null
          status: string
          stitch_types: string[] | null
          total_squares: number | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          calculator_input?: Json | null
          calculator_result?: Json | null
          colors?: string[] | null
          completed_squares?: number
          cover_image_url?: string | null
          created_at?: string
          currency?: string
          deleted_at?: string | null
          description?: string | null
          difficulty?: string | null
          estimated_cost_minor?: number | null
          estimated_time_hours?: number | null
          hook_size_mm?: number | null
          id?: string
          name: string
          notes?: string | null
          size?: string | null
          square_size_cm?: number | null
          status?: string
          stitch_types?: string[] | null
          total_squares?: number | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          calculator_input?: Json | null
          calculator_result?: Json | null
          colors?: string[] | null
          completed_squares?: number
          cover_image_url?: string | null
          created_at?: string
          currency?: string
          deleted_at?: string | null
          description?: string | null
          difficulty?: string | null
          estimated_cost_minor?: number | null
          estimated_time_hours?: number | null
          hook_size_mm?: number | null
          id?: string
          name?: string
          notes?: string | null
          size?: string | null
          square_size_cm?: number | null
          status?: string
          stitch_types?: string[] | null
          total_squares?: number | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_capabilities: {
        Row: {
          capability: string
          granted_at: string
          user_id: string
        }
        Insert: {
          capability: string
          granted_at?: string
          user_id: string
        }
        Update: {
          capability?: string
          granted_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_capabilities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      yarn_stash: {
        Row: {
          brand: string | null
          color_code: string | null
          color_name: string
          color_swatch_hex: string | null
          cost_minor: number | null
          created_at: string
          currency: string
          deleted_at: string | null
          dye_lot: string | null
          fiber: string | null
          id: string
          image_url: string | null
          meters_per_100g: number | null
          name: string
          notes: string | null
          purchase_date: string | null
          remaining_grams: number
          total_grams: number
          updated_at: string
          user_id: string
          weight_class: string
        }
        Insert: {
          brand?: string | null
          color_code?: string | null
          color_name: string
          color_swatch_hex?: string | null
          cost_minor?: number | null
          created_at?: string
          currency?: string
          deleted_at?: string | null
          dye_lot?: string | null
          fiber?: string | null
          id?: string
          image_url?: string | null
          meters_per_100g?: number | null
          name: string
          notes?: string | null
          purchase_date?: string | null
          remaining_grams: number
          total_grams: number
          updated_at?: string
          user_id: string
          weight_class: string
        }
        Update: {
          brand?: string | null
          color_code?: string | null
          color_name?: string
          color_swatch_hex?: string | null
          cost_minor?: number | null
          created_at?: string
          currency?: string
          deleted_at?: string | null
          dye_lot?: string | null
          fiber?: string | null
          id?: string
          image_url?: string | null
          meters_per_100g?: number | null
          name?: string
          notes?: string | null
          purchase_date?: string | null
          remaining_grams?: number
          total_grams?: number
          updated_at?: string
          user_id?: string
          weight_class?: string
        }
        Relationships: [
          {
            foreignKeyName: "yarn_stash_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      yarn_usage: {
        Row: {
          grams_used: number
          id: string
          project_id: string | null
          used_at: string
          user_id: string
          yarn_stash_id: string
        }
        Insert: {
          grams_used: number
          id?: string
          project_id?: string | null
          used_at?: string
          user_id: string
          yarn_stash_id: string
        }
        Update: {
          grams_used?: number
          id?: string
          project_id?: string | null
          used_at?: string
          user_id?: string
          yarn_stash_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "yarn_usage_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "yarn_usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "yarn_usage_yarn_stash_id_fkey"
            columns: ["yarn_stash_id"]
            isOneToOne: false
            referencedRelation: "yarn_stash"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_grant_capability: {
        Args: { cap: string; target_user_id: string }
        Returns: undefined
      }
      admin_platform_stats: { Args: never; Returns: Json }
      admin_revoke_capability: {
        Args: { cap: string; target_user_id: string }
        Returns: undefined
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
