


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."ad_accounts" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "meta_ad_account_id" "text" NOT NULL,
    "account_name" "text" NOT NULL,
    "currency" "text" DEFAULT 'USD'::"text" NOT NULL,
    "timezone" "text",
    "status" "text" DEFAULT 'active'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."ad_accounts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ad_metrics" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "ad_account_id" "uuid" NOT NULL,
    "campaign_id" "text",
    "campaign_name" "text",
    "adset_id" "text",
    "adset_name" "text",
    "ad_id" "text",
    "ad_name" "text",
    "date" "date" NOT NULL,
    "spend" numeric(12,2) DEFAULT 0 NOT NULL,
    "impressions" integer DEFAULT 0 NOT NULL,
    "clicks" integer DEFAULT 0 NOT NULL,
    "ctr" numeric(5,4) GENERATED ALWAYS AS (
CASE
    WHEN ("impressions" > 0) THEN (("clicks")::numeric / ("impressions")::numeric)
    ELSE (0)::numeric
END) STORED,
    "cpc" numeric(10,4) GENERATED ALWAYS AS (
CASE
    WHEN ("clicks" > 0) THEN ("spend" / ("clicks")::numeric)
    ELSE (0)::numeric
END) STORED,
    "conversions" integer DEFAULT 0,
    "conversion_value" numeric(12,2) DEFAULT 0,
    "roas" numeric(10,4) GENERATED ALWAYS AS (
CASE
    WHEN ("spend" > (0)::numeric) THEN ("conversion_value" / "spend")
    ELSE (0)::numeric
END) STORED,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."ad_metrics" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ai_generations" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "ad_account_id" "uuid",
    "campaign_id" "text",
    "campaign_name" "text",
    "prompt" "text" NOT NULL,
    "ad_objective" "text",
    "target_audience" "text",
    "product_description" "text",
    "generated_content" "jsonb" NOT NULL,
    "model_used" "text" NOT NULL,
    "selected_variation" integer,
    "feedback" "text",
    "implemented" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."ai_generations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "email" "text" NOT NULL,
    "full_name" "text",
    "avatar_url" "text",
    "meta_access_token" "text",
    "meta_access_token_expires_at" timestamp with time zone,
    "meta_refresh_token" "text",
    "openrouter_api_key" "text",
    "subscription_tier" "text" DEFAULT 'free'::"text",
    "subscription_status" "text" DEFAULT 'active'::"text",
    "subscription_expires_at" timestamp with time zone,
    "ai_credits" integer DEFAULT 10,
    "ai_credits_reset_at" timestamp with time zone DEFAULT ("now"() + '1 mon'::interval),
    "stripe_customer_id" "text",
    "stripe_subscription_id" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "valid_email" CHECK (("email" ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::"text")),
    CONSTRAINT "valid_subscription_status" CHECK (("subscription_status" = ANY (ARRAY['active'::"text", 'inactive'::"text", 'trial'::"text", 'expired'::"text", 'cancelled'::"text"]))),
    CONSTRAINT "valid_subscription_tier" CHECK (("subscription_tier" = ANY (ARRAY['free'::"text", 'basic'::"text", 'pro'::"text", 'agency'::"text"])))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."site_settings" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "key" "text" NOT NULL,
    "value" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."site_settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_feedback" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "rating" integer NOT NULL,
    "category" "text" NOT NULL,
    "comment" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "user_feedback_category_check" CHECK (("category" = ANY (ARRAY['Bug'::"text", 'Feature Request'::"text", 'General'::"text"]))),
    CONSTRAINT "user_feedback_rating_check" CHECK ((("rating" >= 1) AND ("rating" <= 5)))
);


ALTER TABLE "public"."user_feedback" OWNER TO "postgres";


ALTER TABLE ONLY "public"."ad_accounts"
    ADD CONSTRAINT "ad_accounts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ad_accounts"
    ADD CONSTRAINT "ad_accounts_user_id_meta_ad_account_id_key" UNIQUE ("user_id", "meta_ad_account_id");



ALTER TABLE ONLY "public"."ad_metrics"
    ADD CONSTRAINT "ad_metrics_ad_id_date_key" UNIQUE ("ad_id", "date");



ALTER TABLE ONLY "public"."ad_metrics"
    ADD CONSTRAINT "ad_metrics_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ai_generations"
    ADD CONSTRAINT "ai_generations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."site_settings"
    ADD CONSTRAINT "site_settings_key_key" UNIQUE ("key");



ALTER TABLE ONLY "public"."site_settings"
    ADD CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_feedback"
    ADD CONSTRAINT "user_feedback_pkey" PRIMARY KEY ("id");



CREATE OR REPLACE TRIGGER "update_profiles_updated_at" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_site_settings_updated_at" BEFORE UPDATE ON "public"."site_settings" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."ad_accounts"
    ADD CONSTRAINT "ad_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ad_metrics"
    ADD CONSTRAINT "ad_metrics_ad_account_id_fkey" FOREIGN KEY ("ad_account_id") REFERENCES "public"."ad_accounts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ai_generations"
    ADD CONSTRAINT "ai_generations_ad_account_id_fkey" FOREIGN KEY ("ad_account_id") REFERENCES "public"."ad_accounts"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."ai_generations"
    ADD CONSTRAINT "ai_generations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_feedback"
    ADD CONSTRAINT "user_feedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "App can manage site settings" ON "public"."site_settings" USING (true) WITH CHECK (true);



CREATE POLICY "Public can view site settings" ON "public"."site_settings" FOR SELECT USING (true);



CREATE POLICY "Users can delete their own ad accounts" ON "public"."ad_accounts" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own AI generations" ON "public"."ai_generations" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own ad accounts" ON "public"."ad_accounts" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own feedback" ON "public"."user_feedback" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own profile" ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own ad accounts" ON "public"."ad_accounts" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own profile" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view metrics for their own ad accounts" ON "public"."ad_metrics" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."ad_accounts"
  WHERE (("ad_accounts"."id" = "ad_metrics"."ad_account_id") AND ("ad_accounts"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can view their own AI generations" ON "public"."ai_generations" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own ad accounts" ON "public"."ad_accounts" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own feedback" ON "public"."user_feedback" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own profile" ON "public"."profiles" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."ad_accounts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."ad_metrics" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."ai_generations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."site_settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_feedback" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";


















GRANT ALL ON TABLE "public"."ad_accounts" TO "anon";
GRANT ALL ON TABLE "public"."ad_accounts" TO "authenticated";
GRANT ALL ON TABLE "public"."ad_accounts" TO "service_role";



GRANT ALL ON TABLE "public"."ad_metrics" TO "anon";
GRANT ALL ON TABLE "public"."ad_metrics" TO "authenticated";
GRANT ALL ON TABLE "public"."ad_metrics" TO "service_role";



GRANT ALL ON TABLE "public"."ai_generations" TO "anon";
GRANT ALL ON TABLE "public"."ai_generations" TO "authenticated";
GRANT ALL ON TABLE "public"."ai_generations" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."site_settings" TO "anon";
GRANT ALL ON TABLE "public"."site_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."site_settings" TO "service_role";



GRANT ALL ON TABLE "public"."user_feedback" TO "anon";
GRANT ALL ON TABLE "public"."user_feedback" TO "authenticated";
GRANT ALL ON TABLE "public"."user_feedback" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































drop extension if exists "pg_net";


