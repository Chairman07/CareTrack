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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      patients: {
        Row: {
          address_city: string | null
          address_postal_code: string | null
          address_province: string | null
          address_street: string | null
          address_suburb: string | null
          created_at: string
          date_of_birth: string
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          first_name: string
          gender: Database["public"]["Enums"]["gender_type"] | null
          id: number
          is_active: boolean
          last_name: string
          medical_aid_number: string | null
          medical_aid_plan: string | null
          phone: string | null
          sa_id: string
          updated_at: string
        }
        Insert: {
          address_city?: string | null
          address_postal_code?: string | null
          address_province?: string | null
          address_street?: string | null
          address_suburb?: string | null
          created_at?: string
          date_of_birth: string
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name: string
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id?: number
          is_active?: boolean
          last_name: string
          medical_aid_number?: string | null
          medical_aid_plan?: string | null
          phone?: string | null
          sa_id: string
          updated_at?: string
        }
        Update: {
          address_city?: string | null
          address_postal_code?: string | null
          address_province?: string | null
          address_street?: string | null
          address_suburb?: string | null
          created_at?: string
          date_of_birth?: string
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id?: number
          is_active?: boolean
          last_name?: string
          medical_aid_number?: string | null
          medical_aid_plan?: string | null
          phone?: string | null
          sa_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      roles: {
        Row: {
          created_at: string
          description: string
          id: number
          name: Database["public"]["Enums"]["role_type"]
          permissions: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: number
          name: Database["public"]["Enums"]["role_type"]
          permissions?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          name?: Database["public"]["Enums"]["role_type"]
          permissions?: Json
          updated_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: number
          is_active: boolean
          last_login: string | null
          last_name: string
          phone: string | null
          role_id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: number
          is_active?: boolean
          last_login?: string | null
          last_name: string
          phone?: string | null
          role_id: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: number
          is_active?: boolean
          last_login?: string | null
          last_name?: string
          phone?: string | null
          role_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      visits: {
        Row: {
          chief_complaint: string | null
          created_at: string
          diagnosis_notes: string | null
          follow_up_date: string | null
          follow_up_required: boolean
          id: number
          medications_prescribed: string | null
          patient_id: number
          treatment_notes: string | null
          updated_at: string
          user_id: number
          visit_date: string
          visit_status: Database["public"]["Enums"]["visit_status"]
          vital_signs: Json | null
        }
        Insert: {
          chief_complaint?: string | null
          created_at?: string
          diagnosis_notes?: string | null
          follow_up_date?: string | null
          follow_up_required?: boolean
          id?: number
          medications_prescribed?: string | null
          patient_id: number
          treatment_notes?: string | null
          updated_at?: string
          user_id: number
          visit_date?: string
          visit_status?: Database["public"]["Enums"]["visit_status"]
          vital_signs?: Json | null
        }
        Update: {
          chief_complaint?: string | null
          created_at?: string
          diagnosis_notes?: string | null
          follow_up_date?: string | null
          follow_up_required?: boolean
          id?: number
          medications_prescribed?: string | null
          patient_id?: number
          treatment_notes?: string | null
          updated_at?: string
          user_id?: number
          visit_date?: string
          visit_status?: Database["public"]["Enums"]["visit_status"]
          vital_signs?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "visits_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      gender_type: "male" | "female" | "other" | "prefer_not_to_say"
      role_type: "admin" | "doctor" | "nurse"
      visit_status: "scheduled" | "completed" | "cancelled" | "no_show"
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
      gender_type: ["male", "female", "other", "prefer_not_to_say"],
      role_type: ["admin", "doctor", "nurse"],
      visit_status: ["scheduled", "completed", "cancelled", "no_show"],
    },
  },
} as const
