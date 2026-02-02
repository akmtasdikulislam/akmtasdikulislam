import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SectionHeading from "@/components/ui/SectionHeading";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  Send,
} from "lucide-react";
import { useState } from "react";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "akmtasdikulislam@gmail.com",
    href: "mailto:akmtasdikulislam@gmail.com",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Dhaka, Bangladesh",
    href: "#",
  },
];

const codingProfiles = [
  {
    name: "CodeForces",
    href: "https://codeforces.com/profile/akmtasdikulislam",
    icon: "https://img.icons8.com/external-tal-revivo-color-tal-revivo/24/external-codeforces-programming-competitions-and-contests-programming-community-logo-color-tal-revivo.png",
  },
  {
    name: "LeetCode",
    href: "https://leetcode.com/u/akmtasdikulislam/",
    icon: "https://img.icons8.com/external-tal-revivo-color-tal-revivo/24/external-level-up-your-coding-skills-and-quickly-land-a-job-logo-color-tal-revivo.png",
  },
  {
    name: "HackerRank",
    href: "https://www.hackerrank.com/profile/akmtasdikulislam",
    icon: "https://upload.wikimedia.org/wikipedia/commons/4/40/HackerRank_Icon-1000px.png",
  },
  {
    name: "CodeChef",
    href: "https://www.codechef.com/users/akmtasdikul",
    icon: "https://img.icons8.com/fluency/48/codechef.png",
  },
];

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent!",
      description: "Thank you for reaching out. I'll get back to you soon!",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-secondary/10">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <SectionHeading
          badge="Contact"
          title="Get In"
          highlight="Touch"
          description="Have a project in mind? Let's work together!"
        />

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left - Contact form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form
              onSubmit={handleSubmit}
              className="p-4 sm:p-6 md:p-8 bg-card border border-border rounded-2xl space-y-6"
            >
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <Send className="w-5 h-5 text-primary" />
                Send Me a Message
              </h3>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Your Name
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="bg-secondary border-border"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Your Email
                </label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                  className="bg-secondary border-border"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Subject
                </label>
                <Input
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Project Inquiry"
                  required
                  className="bg-secondary border-border"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Message
                </label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project..."
                  rows={5}
                  required
                  className="bg-secondary border-border resize-none"
                />
              </div>

              <Button type="submit" size="lg" variant="glow" className="w-full min-h-[48px]">
                <Send className="w-4 h-4" />
                Send Message
              </Button>
            </form>
          </motion.div>

          {/* Right - Contact info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Contact cards */}
            <div className="space-y-4">
              {contactInfo.map((item) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:glow-green-sm transition-all">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="font-medium">{item.value}</p>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Available for Work box - Exact screenshot design with green border */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-5 bg-card border border-[#22c55e] rounded-xl"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse" />
                <h4 className="font-semibold text-[#22c55e]">Available for Work</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Currently accepting freelance and remote opportunities. Let's build something amazing together!
              </p>
            </motion.div>

            {/* Hire buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="https://www.upwork.com/freelancers/~01fe1fc80c8877ffe2"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 h-11 min-h-[44px] rounded-md text-sm font-medium bg-[#14a800] hover:bg-[#14a800]/90 text-white glow-green transition-all active:scale-[0.98] flex-1 sm:flex-initial"
              >
                <img
                  src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/upwork.svg"
                  alt="Upwork"
                  className="w-4 h-4 invert"
                />
                Hire me on Upwork
              </a>
              <a
                href="https://www.linkedin.com/in/akmtasdikulislam"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 h-11 min-h-[44px] rounded-md text-sm font-medium bg-[#0077b5] hover:bg-[#0077b5]/90 text-white transition-all active:scale-[0.98] flex-1 sm:flex-initial"
              >
                <img
                  src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linkedin.svg"
                  alt="LinkedIn"
                  className="w-4 h-4 invert"
                />
                Connect on LinkedIn
              </a>
            </motion.div>

            {/* Freelance/Work Profiles */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Freelance/Work Profiles
              </h4>
              <div className="flex flex-wrap gap-3">
                {[
                  {
                    name: "Upwork",
                    href: "https://www.upwork.com/freelancers/~01fe1fc80c8877ffe2",
                    icon: "https://img.icons8.com/external-tal-revivo-color-tal-revivo/24/external-upwork-a-global-freelancing-platform-where-professionals-connect-and-collaborate-remotely-logo-color-tal-revivo.png",
                  },
                  {
                    name: "Fiverr",
                    href: "#",
                    icon: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/fiverr-icon.svg",
                  },
                  {
                    name: "Freelancer",
                    href: "https://www.freelancer.com",
                    icon: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/freelancer-icon.svg",
                  },
                ].map((profile) => (
                  <motion.a
                    key={profile.name}
                    href={profile.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    className="px-3 sm:px-4 py-2 bg-card border border-border rounded-lg text-sm transition-all flex items-center gap-2 group hover:border-primary/50 min-h-[44px]"
                  >
                    <img
                      src={profile.icon}
                      alt={profile.name}
                      className="w-5 h-5 object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                      {profile.name}
                    </span>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Coding profiles - Same grayscale-to-color as Tech Expertise marquee */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Coding Profiles
              </h4>
              <div className="flex flex-wrap gap-3">
                {codingProfiles.map((profile) => (
                  <motion.a
                    key={profile.name}
                    href={profile.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-2 bg-card border border-border rounded-lg text-sm transition-all flex items-center gap-2 group hover:border-primary/50"
                  >
                    <img
                      src={profile.icon}
                      alt={profile.name}
                      className="w-5 h-5 object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                      {profile.name}
                    </span>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
