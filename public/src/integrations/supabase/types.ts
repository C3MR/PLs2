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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          activity_type: Database["public"]["Enums"]["activity_type"]
          created_at: string
          entity_id: string | null
          entity_type: string | null
          error_message: string | null
          id: string
          ip_address: unknown | null
          metadata: Json | null
          session_id: string | null
          success: boolean | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          activity_type: Database["public"]["Enums"]["activity_type"]
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          error_message?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          session_id?: string | null
          success?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          activity_type?: Database["public"]["Enums"]["activity_type"]
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          error_message?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          session_id?: string | null
          success?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          client_id: string
          completed_deals: number | null
          created_at: string
          created_by: string | null
          email: string
          id: string
          join_date: string
          last_activity: string | null
          name: string
          notes: string | null
          phone: string
          preferred_areas: string[] | null
          rating: number | null
          status: string
          total_requests: number | null
          total_value: number | null
          type: string
          updated_at: string
        }
        Insert: {
          client_id: string
          completed_deals?: number | null
          created_at?: string
          created_by?: string | null
          email: string
          id?: string
          join_date?: string
          last_activity?: string | null
          name: string
          notes?: string | null
          phone: string
          preferred_areas?: string[] | null
          rating?: number | null
          status?: string
          total_requests?: number | null
          total_value?: number | null
          type?: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          completed_deals?: number | null
          created_at?: string
          created_by?: string | null
          email?: string
          id?: string
          join_date?: string
          last_activity?: string | null
          name?: string
          notes?: string | null
          phone?: string
          preferred_areas?: string[] | null
          rating?: number | null
          status?: string
          total_requests?: number | null
          total_value?: number | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string
          status: string
          subject: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone: string
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      crm_tasks: {
        Row: {
          assigned_to: string
          client_id: string | null
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          due_date: string | null
          id: string
          lead_id: string | null
          priority: Database["public"]["Enums"]["task_priority"] | null
          property_id: string | null
          status: Database["public"]["Enums"]["task_status"] | null
          tags: string[] | null
          title: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_to: string
          client_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          lead_id?: string | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          property_id?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          tags?: string[] | null
          title: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string
          client_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          lead_id?: string | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          property_id?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          tags?: string[] | null
          title?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_tasks_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_tasks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_tasks_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      file_metadata: {
        Row: {
          bucket_id: string
          created_at: string
          description: string | null
          entity_id: string | null
          entity_type: string | null
          file_path: string
          file_size: number
          id: string
          is_primary: boolean | null
          mime_type: string
          original_name: string
          tags: string[] | null
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          bucket_id: string
          created_at?: string
          description?: string | null
          entity_id?: string | null
          entity_type?: string | null
          file_path: string
          file_size: number
          id?: string
          is_primary?: boolean | null
          mime_type: string
          original_name: string
          tags?: string[] | null
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          bucket_id?: string
          created_at?: string
          description?: string | null
          entity_id?: string | null
          entity_type?: string | null
          file_path?: string
          file_size?: number
          id?: string
          is_primary?: boolean | null
          mime_type?: string
          original_name?: string
          tags?: string[] | null
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      lead_activities: {
        Row: {
          activity_type: string
          contact_method: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          duration_minutes: number | null
          follow_up_date: string | null
          id: string
          lead_id: string | null
          outcome: string | null
          requires_follow_up: boolean | null
          subject: string | null
        }
        Insert: {
          activity_type: string
          contact_method?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration_minutes?: number | null
          follow_up_date?: string | null
          id?: string
          lead_id?: string | null
          outcome?: string | null
          requires_follow_up?: boolean | null
          subject?: string | null
        }
        Update: {
          activity_type?: string
          contact_method?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration_minutes?: number | null
          follow_up_date?: string | null
          id?: string
          lead_id?: string | null
          outcome?: string | null
          requires_follow_up?: boolean | null
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_to: string | null
          budget_max: number | null
          budget_min: number | null
          created_at: string | null
          created_by: string | null
          email: string | null
          first_name: string
          id: string
          interested_property_type: string | null
          last_contact_date: string | null
          last_name: string
          lead_id: string
          next_follow_up: string | null
          notes: string | null
          phone: string
          preferred_location: string | null
          priority: Database["public"]["Enums"]["task_priority"] | null
          requirements: string | null
          score: number | null
          secondary_phone: string | null
          source: Database["public"]["Enums"]["lead_source"]
          status: Database["public"]["Enums"]["lead_status"]
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          first_name: string
          id?: string
          interested_property_type?: string | null
          last_contact_date?: string | null
          last_name: string
          lead_id?: string
          next_follow_up?: string | null
          notes?: string | null
          phone: string
          preferred_location?: string | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          requirements?: string | null
          score?: number | null
          secondary_phone?: string | null
          source?: Database["public"]["Enums"]["lead_source"]
          status?: Database["public"]["Enums"]["lead_status"]
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          first_name?: string
          id?: string
          interested_property_type?: string | null
          last_contact_date?: string | null
          last_name?: string
          lead_id?: string
          next_follow_up?: string | null
          notes?: string | null
          phone?: string
          preferred_location?: string | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          requirements?: string | null
          score?: number | null
          secondary_phone?: string | null
          source?: Database["public"]["Enums"]["lead_source"]
          status?: Database["public"]["Enums"]["lead_status"]
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          appointment_notifications: boolean
          client_notifications: boolean
          created_at: string
          email_enabled: boolean
          id: string
          property_notifications: boolean
          push_enabled: boolean
          quiet_hours_end: string | null
          quiet_hours_start: string | null
          system_notifications: boolean
          task_notifications: boolean
          updated_at: string
          user_id: string | null
        }
        Insert: {
          appointment_notifications?: boolean
          client_notifications?: boolean
          created_at?: string
          email_enabled?: boolean
          id?: string
          property_notifications?: boolean
          push_enabled?: boolean
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          system_notifications?: boolean
          task_notifications?: boolean
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          appointment_notifications?: boolean
          client_notifications?: boolean
          created_at?: string
          email_enabled?: boolean
          id?: string
          property_notifications?: boolean
          push_enabled?: boolean
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          system_notifications?: boolean
          task_notifications?: boolean
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          expires_at: string | null
          id: string
          is_global: boolean
          is_read: boolean
          message: string
          metadata: Json | null
          priority: Database["public"]["Enums"]["notification_priority"]
          read_at: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string | null
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_global?: boolean
          is_read?: boolean
          message: string
          metadata?: Json | null
          priority?: Database["public"]["Enums"]["notification_priority"]
          read_at?: string | null
          title: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string | null
        }
        Update: {
          action_url?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_global?: boolean
          is_read?: boolean
          message?: string
          metadata?: Json | null
          priority?: Database["public"]["Enums"]["notification_priority"]
          read_at?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string | null
          employee_id: string | null
          full_name: string
          id: string
          is_active: boolean | null
          last_login: string | null
          phone: string | null
          role: Database["public"]["Enums"]["app_role"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          employee_id?: string | null
          full_name: string
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          employee_id?: string | null
          full_name?: string
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          ad_license_number: string | null
          amenities: string[] | null
          apartments_count: number | null
          area: number | null
          bathrooms: number | null
          bedrooms: number | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          images: string[] | null
          license_number: string | null
          location: string
          occupied_percentage: number | null
          offices_count: number | null
          price: number
          property_type: string
          property_usage: string | null
          showrooms_count: number | null
          status: string
          title: string
          total_units: number | null
          updated_at: string
          vacant_units: number | null
        }
        Insert: {
          ad_license_number?: string | null
          amenities?: string[] | null
          apartments_count?: number | null
          area?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          license_number?: string | null
          location: string
          occupied_percentage?: number | null
          offices_count?: number | null
          price: number
          property_type?: string
          property_usage?: string | null
          showrooms_count?: number | null
          status?: string
          title: string
          total_units?: number | null
          updated_at?: string
          vacant_units?: number | null
        }
        Update: {
          ad_license_number?: string | null
          amenities?: string[] | null
          apartments_count?: number | null
          area?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          license_number?: string | null
          location?: string
          occupied_percentage?: number | null
          offices_count?: number | null
          price?: number
          property_type?: string
          property_usage?: string | null
          showrooms_count?: number | null
          status?: string
          title?: string
          total_units?: number | null
          updated_at?: string
          vacant_units?: number | null
        }
        Relationships: []
      }
      property_requests: {
        Row: {
          activity_category: string | null
          assigned_to: string | null
          branches_count: string | null
          business_activity: string | null
          capacity: string
          capacity_other: string | null
          created_at: string
          email: string | null
          establishment_name: string | null
          full_name: string
          how_did_you_hear_about_us: string | null
          id: string
          max_area: number | null
          min_area: number | null
          notes: string | null
          phone: string
          preferred_districts: string[] | null
          price_option: string | null
          property_type: string
          purpose: string
          request_id: string
          specific_budget: number | null
          specific_type: string
          status: string
          updated_at: string
        }
        Insert: {
          activity_category?: string | null
          assigned_to?: string | null
          branches_count?: string | null
          business_activity?: string | null
          capacity: string
          capacity_other?: string | null
          created_at?: string
          email?: string | null
          establishment_name?: string | null
          full_name: string
          how_did_you_hear_about_us?: string | null
          id?: string
          max_area?: number | null
          min_area?: number | null
          notes?: string | null
          phone: string
          preferred_districts?: string[] | null
          price_option?: string | null
          property_type: string
          purpose: string
          request_id: string
          specific_budget?: number | null
          specific_type: string
          status?: string
          updated_at?: string
        }
        Update: {
          activity_category?: string | null
          assigned_to?: string | null
          branches_count?: string | null
          business_activity?: string | null
          capacity?: string
          capacity_other?: string | null
          created_at?: string
          email?: string | null
          establishment_name?: string | null
          full_name?: string
          how_did_you_hear_about_us?: string | null
          id?: string
          max_area?: number | null
          min_area?: number | null
          notes?: string | null
          phone?: string
          preferred_districts?: string[] | null
          price_option?: string | null
          property_type?: string
          purpose?: string
          request_id?: string
          specific_budget?: number | null
          specific_type?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      rate_limit_log: {
        Row: {
          created_at: string | null
          form_type: string
          id: string
          ip_address: unknown | null
        }
        Insert: {
          created_at?: string | null
          form_type: string
          id?: string
          ip_address?: unknown | null
        }
        Update: {
          created_at?: string | null
          form_type?: string
          id?: string
          ip_address?: unknown | null
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          created_at: string
          id: string
          permission: Database["public"]["Enums"]["permission"]
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          created_at?: string
          id?: string
          permission: Database["public"]["Enums"]["permission"]
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          created_at?: string
          id?: string
          permission?: Database["public"]["Enums"]["permission"]
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      sales_pipeline: {
        Row: {
          actual_close_date: string | null
          assigned_agent: string | null
          commission_amount: number | null
          commission_rate: number | null
          created_at: string | null
          deal_value: number
          expected_close_date: string | null
          id: string
          lead_id: string | null
          probability: number | null
          property_id: string | null
          stage: Database["public"]["Enums"]["lead_status"]
          stage_changed_at: string | null
          updated_at: string | null
        }
        Insert: {
          actual_close_date?: string | null
          assigned_agent?: string | null
          commission_amount?: number | null
          commission_rate?: number | null
          created_at?: string | null
          deal_value: number
          expected_close_date?: string | null
          id?: string
          lead_id?: string | null
          probability?: number | null
          property_id?: string | null
          stage?: Database["public"]["Enums"]["lead_status"]
          stage_changed_at?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_close_date?: string | null
          assigned_agent?: string | null
          commission_amount?: number | null
          commission_rate?: number | null
          created_at?: string | null
          deal_value?: number
          expected_close_date?: string | null
          id?: string
          lead_id?: string | null
          probability?: number | null
          property_id?: string | null
          stage?: Database["public"]["Enums"]["lead_status"]
          stage_changed_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_pipeline_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_pipeline_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      security_events: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          ip_address: unknown | null
          metadata: Json | null
          severity: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          severity?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          severity?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      service_requests: {
        Row: {
          activity_type: string | null
          client_email: string | null
          client_name: string
          client_phone: string
          contact_method: string
          created_at: string
          facility_name: string | null
          id: string
          preferred_time: string | null
          property_type: string | null
          property_usage: string | null
          request_description: string | null
          request_id: string
          service_type: string
          status: string | null
          updated_at: string
        }
        Insert: {
          activity_type?: string | null
          client_email?: string | null
          client_name: string
          client_phone: string
          contact_method: string
          created_at?: string
          facility_name?: string | null
          id?: string
          preferred_time?: string | null
          property_type?: string | null
          property_usage?: string | null
          request_description?: string | null
          request_id: string
          service_type: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          activity_type?: string | null
          client_email?: string | null
          client_name?: string
          client_phone?: string
          contact_method?: string
          created_at?: string
          facility_name?: string | null
          id?: string
          preferred_time?: string | null
          property_type?: string | null
          property_usage?: string | null
          request_description?: string | null
          request_id?: string
          service_type?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      authenticate_employee: {
        Args: { email_input: string; password_input: string }
        Returns: Json
      }
      check_rate_limit: {
        Args: {
          p_form_type: string
          p_ip_address: unknown
          p_max_requests?: number
          p_time_window_minutes?: number
        }
        Returns: boolean
      }
      cleanup_expired_notifications: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      cleanup_rate_limit_logs: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      create_admin_user: {
        Args: { full_name?: string; user_email: string; user_password: string }
        Returns: string
      }
      create_auth_user_for_admin: {
        Args: { temp_password?: string; user_email: string }
        Returns: Json
      }
      create_notification: {
        Args: {
          p_action_url?: string
          p_expires_at?: string
          p_is_global?: boolean
          p_message: string
          p_metadata?: Json
          p_priority?: Database["public"]["Enums"]["notification_priority"]
          p_title: string
          p_type?: Database["public"]["Enums"]["notification_type"]
          p_user_id: string
        }
        Returns: string
      }
      generate_client_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_activity_summary: {
        Args: { p_days?: number }
        Returns: {
          activity_type: Database["public"]["Enums"]["activity_type"]
          count: number
          last_occurrence: string
        }[]
      }
      get_notification_stats: {
        Args: { p_user_id?: string }
        Returns: {
          recent_count: number
          total_count: number
          unread_count: number
          urgent_count: number
        }[]
      }
      get_user_permissions: {
        Args: { user_id?: string }
        Returns: Database["public"]["Enums"]["permission"][]
      }
      get_user_role: {
        Args: { user_id?: string }
        Returns: string
      }
      has_permission: {
        Args: {
          required_permission: Database["public"]["Enums"]["permission"]
          user_id: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          required_role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Returns: boolean
      }
      link_user_to_profile: {
        Args: { p_email: string; p_user_id: string }
        Returns: Json
      }
      log_activity: {
        Args: {
          p_activity_type: Database["public"]["Enums"]["activity_type"]
          p_entity_id?: string
          p_entity_type?: string
          p_error_message?: string
          p_ip_address?: unknown
          p_metadata?: Json
          p_session_id?: string
          p_success?: boolean
          p_user_agent?: string
          p_user_id: string
        }
        Returns: string
      }
      log_security_event: {
        Args: {
          p_event_type: string
          p_ip_address?: unknown
          p_metadata?: Json
          p_severity?: string
          p_user_agent?: string
          p_user_id?: string
        }
        Returns: string
      }
      mark_all_notifications_read: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      mark_notification_read: {
        Args: { notification_id: string }
        Returns: boolean
      }
      reset_employee_password: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
    }
    Enums: {
      activity_type:
        | "auth:login"
        | "auth:logout"
        | "auth:signup"
        | "auth:password_change"
        | "user:profile_update"
        | "user:role_change"
        | "property:create"
        | "property:update"
        | "property:delete"
        | "property:view"
        | "client:create"
        | "client:update"
        | "client:delete"
        | "client:view"
        | "request:create"
        | "request:update"
        | "request:assign"
        | "request:status_change"
        | "file:upload"
        | "file:download"
        | "file:delete"
        | "system:settings_change"
        | "system:backup"
        | "system:export"
      app_role:
        | "super_admin"
        | "admin"
        | "manager"
        | "agent"
        | "employee"
        | "client"
      lead_source:
        | "website"
        | "phone_call"
        | "referral"
        | "social_media"
        | "advertisement"
        | "walk_in"
        | "event"
        | "other"
      lead_status:
        | "new"
        | "contacted"
        | "qualified"
        | "proposal_sent"
        | "negotiation"
        | "won"
        | "lost"
        | "on_hold"
      notification_priority: "low" | "medium" | "high" | "urgent"
      notification_type:
        | "info"
        | "warning"
        | "success"
        | "error"
        | "system"
        | "property_update"
        | "client_message"
        | "task_reminder"
        | "appointment"
        | "document_upload"
      permission:
        | "properties:create"
        | "properties:read"
        | "properties:update"
        | "properties:delete"
        | "properties:publish"
        | "clients:create"
        | "clients:read"
        | "clients:update"
        | "clients:delete"
        | "clients:export"
        | "requests:create"
        | "requests:read"
        | "requests:update"
        | "requests:delete"
        | "requests:assign"
        | "analytics:read"
        | "analytics:export"
        | "users:create"
        | "users:read"
        | "users:update"
        | "users:delete"
        | "users:roles"
        | "system:settings"
        | "system:backup"
        | "system:logs"
        | "leads:create"
        | "leads:read"
        | "leads:update"
        | "leads:delete"
        | "sales:create"
        | "sales:read"
        | "sales:update"
        | "sales:delete"
        | "sales:manage"
        | "tasks:create"
        | "tasks:read"
        | "tasks:update"
        | "tasks:delete"
        | "crm:admin"
      task_priority: "low" | "medium" | "high" | "urgent"
      task_status: "pending" | "in_progress" | "completed" | "cancelled"
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
      activity_type: [
        "auth:login",
        "auth:logout",
        "auth:signup",
        "auth:password_change",
        "user:profile_update",
        "user:role_change",
        "property:create",
        "property:update",
        "property:delete",
        "property:view",
        "client:create",
        "client:update",
        "client:delete",
        "client:view",
        "request:create",
        "request:update",
        "request:assign",
        "request:status_change",
        "file:upload",
        "file:download",
        "file:delete",
        "system:settings_change",
        "system:backup",
        "system:export",
      ],
      app_role: [
        "super_admin",
        "admin",
        "manager",
        "agent",
        "employee",
        "client",
      ],
      lead_source: [
        "website",
        "phone_call",
        "referral",
        "social_media",
        "advertisement",
        "walk_in",
        "event",
        "other",
      ],
      lead_status: [
        "new",
        "contacted",
        "qualified",
        "proposal_sent",
        "negotiation",
        "won",
        "lost",
        "on_hold",
      ],
      notification_priority: ["low", "medium", "high", "urgent"],
      notification_type: [
        "info",
        "warning",
        "success",
        "error",
        "system",
        "property_update",
        "client_message",
        "task_reminder",
        "appointment",
        "document_upload",
      ],
      permission: [
        "properties:create",
        "properties:read",
        "properties:update",
        "properties:delete",
        "properties:publish",
        "clients:create",
        "clients:read",
        "clients:update",
        "clients:delete",
        "clients:export",
        "requests:create",
        "requests:read",
        "requests:update",
        "requests:delete",
        "requests:assign",
        "analytics:read",
        "analytics:export",
        "users:create",
        "users:read",
        "users:update",
        "users:delete",
        "users:roles",
        "system:settings",
        "system:backup",
        "system:logs",
        "leads:create",
        "leads:read",
        "leads:update",
        "leads:delete",
        "sales:create",
        "sales:read",
        "sales:update",
        "sales:delete",
        "sales:manage",
        "tasks:create",
        "tasks:read",
        "tasks:update",
        "tasks:delete",
        "crm:admin",
      ],
      task_priority: ["low", "medium", "high", "urgent"],
      task_status: ["pending", "in_progress", "completed", "cancelled"],
    },
  },
} as const
