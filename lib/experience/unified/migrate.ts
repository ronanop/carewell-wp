/**
 * Migration helpers — Blog / Page / Static presentation configs
 * → Unified ExperienceConfig without data loss.
 */

export {
  blogPresentationConfigToExperienceConfig,
  presentationConfigToExperienceConfig,
  experienceConfigToBlogPresentationConfig,
  experienceConfigToPresentationConfig,
  createDefaultExperienceConfig,
  parseExperienceConfig,
  defaultLayoutPresetForKind,
} from "@/lib/experience/validations/experienceConfig";
