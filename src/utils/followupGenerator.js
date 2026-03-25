export function generateFollowupEmail(application) {
  const company = application.company || "the company";
  const role = application.role || "the role";
  const recruiter =
    application.recruiterContact?.split("@")[0] || "Hiring Team";

  return `Subject: Following up on my ${role} application

Hi ${recruiter},

I hope you're doing well. I wanted to follow up on my application for the ${role} position at ${company}.

I'm very excited about the opportunity and would love to hear if there have been any updates regarding the hiring process.

Please let me know if there's any additional information I can provide.

Best regards,
[Your Name]`;
}
