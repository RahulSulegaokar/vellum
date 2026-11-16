import { AuthPage } from "@/components/blocks/auth-page"
import { AuthLogo, AuthSignIn } from "@/components/blocks/auth-sign-in"

const links = [
  { label: "Support", href: "#support" },
  { label: "Privacy", href: "#privacy" },
  { label: "Terms", href: "#terms" },
]

const providers = [
  { id: "github", label: "GitHub" },
  { id: "google", label: "Google" },
]

export default function AuthPageExample() {
  return (
    <AuthPage brand="Acme" year={2026} links={links}>
      <AuthSignIn
        logo={<AuthLogo name="Acme" href="#home" />}
        title="Sign in to Acme"
        subtitle="Welcome back. Sign in to continue."
        providers={providers}
        recentProvider="github"
        signUpHref="#sign-up"
      />
    </AuthPage>
  )
}
