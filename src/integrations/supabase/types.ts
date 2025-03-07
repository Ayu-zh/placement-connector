export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      certifications: {
        Row: {
          created_at: string | null
          description: string
          duration: string
          id: string
          is_active: boolean | null
          name: string
          provider: string
          skills_gained: string[]
        }
        Insert: {
          created_at?: string | null
          description: string
          duration: string
          id?: string
          is_active?: boolean | null
          name: string
          provider: string
          skills_gained: string[]
        }
        Update: {
          created_at?: string | null
          description?: string
          duration?: string
          id?: string
          is_active?: boolean | null
          name?: string
          provider?: string
          skills_gained?: string[]
        }
        Relationships: []
      }
      hackathons: {
        Row: {
          created_at: string | null
          date: string
          id: string
          mode: string
          name: string
          participants: string
          registration_url: string
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          mode: string
          name: string
          participants: string
          registration_url: string
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          mode?: string
          name?: string
          participants?: string
          registration_url?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          company: string
          created_at: string | null
          deadline: string
          id: number
          location: string
          salary: string
          title: string
          type: string
        }
        Insert: {
          company: string
          created_at?: string | null
          deadline: string
          id?: number
          location: string
          salary: string
          title: string
          type: string
        }
        Update: {
          company?: string
          created_at?: string | null
          deadline?: string
          id?: number
          location?: string
          salary?: string
          title?: string
          type?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          department: string | null
          email: string
          id: string
          name: string
          role: Database["public"]["Enums"]["user_role"]
          status: string | null
          updated_at: string | null
          verified: boolean | null
          year: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          email: string
          id: string
          name: string
          role?: Database["public"]["Enums"]["user_role"]
          status?: string | null
          updated_at?: string | null
          verified?: boolean | null
          year?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          email?: string
          id?: string
          name?: string
          role?: Database["public"]["Enums"]["user_role"]
          status?: string | null
          updated_at?: string | null
          verified?: boolean | null
          year?: string | null
        }
        Relationships: []
      }
      teammate_requests: {
        Row: {
          contact_info: string
          created_at: string | null
          description: string
          hackathon_name: string
          id: string
          posted_by: string
          skills: string[]
        }
        Insert: {
          contact_info: string
          created_at?: string | null
          description: string
          hackathon_name: string
          id?: string
          posted_by: string
          skills: string[]
        }
        Update: {
          contact_info?: string
          created_at?: string | null
          description?: string
          hackathon_name?: string
          id?: string
          posted_by?: string
          skills?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "teammate_requests_posted_by_fkey"
            columns: ["posted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      dashboard_stats: {
        Row: {
          active_jobs: number | null
          active_students: number | null
          placement_rate: number | null
          registered_companies: number | null
          total_placements: number | null
          total_students: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "student" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
