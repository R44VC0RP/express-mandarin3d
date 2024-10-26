import Header from "@/components/Header";
import BackgroundEffects from "@/components/BackgroundEffects";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      <BackgroundEffects />
      
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <div className="mt-3 w-full border-t border-b border-[#5E5E5E] bg-[#2A2A2A]">
        <div className="flex items-center justify-left mt-2">
          <p className="ml-4 text-3xl font-bold">Terms of Service</p>
        </div>
        <div className="flex items-center justify-left mb-4">
          <p className="ml-4 mr-4 inline-block text-sm font-light">
            Last updated: March 2024
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="bg-white bg-opacity-10 rounded-3xl p-6 md:p-8 backdrop-blur-md border border-white border-opacity-20">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="terms">
              <AccordionTrigger className="text-xl font-semibold">1. Terms</AccordionTrigger>
              <AccordionContent className="text-gray-300">
                By accessing this Website, accessible from https://mandarin3d.com, you are agreeing to be bound by these Website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws. If you disagree with any of these terms, you are prohibited from accessing this site. The materials contained in this Website are protected by copyright and trade mark law.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="license">
              <AccordionTrigger className="text-xl font-semibold">2. Use License</AccordionTrigger>
              <AccordionContent className="text-gray-300">
                <p>Permission is granted to temporarily download one copy of the materials on EXON ENTERPRISE LLC's Website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                <ul className="list-disc ml-6 mt-2">
                  <li>modify or copy the materials;</li>
                  <li>use the materials for any commercial purpose or for any public display;</li>
                  <li>attempt to reverse engineer any software contained on EXON ENTERPRISE LLC's Website;</li>
                  <li>remove any copyright or other proprietary notations from the materials; or</li>
                  <li>transferring the materials to another person or "mirror" the materials on any other server.</li>
                </ul>
                <p className="mt-2">This will let EXON ENTERPRISE LLC to terminate upon violations of any of these restrictions. Upon termination, your viewing right will also be terminated and you should destroy any downloaded materials in your possession whether it is printed or electronic format.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="disclaimer">
              <AccordionTrigger className="text-xl font-semibold">3. Disclaimer</AccordionTrigger>
              <AccordionContent className="text-gray-300">
                All the materials on EXON ENTERPRISE LLC's Website are provided "as is". EXON ENTERPRISE LLC makes no warranties, may it be expressed or implied, therefore negates all other warranties. Furthermore, EXON ENTERPRISE LLC does not make any representations concerning the accuracy or reliability of the use of the materials on its Website or otherwise relating to such materials or any sites linked to this Website.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="limitations">
              <AccordionTrigger className="text-xl font-semibold">4. Limitations</AccordionTrigger>
              <AccordionContent className="text-gray-300">
                EXON ENTERPRISE LLC or its suppliers will not be hold accountable for any damages that will arise with the use or inability to use the materials on EXON ENTERPRISE LLC's Website, even if EXON ENTERPRISE LLC or an authorize representative of this Website has been notified, orally or written, of the possibility of such damage. Some jurisdiction does not allow limitations on implied warranties or limitations of liability for incidental damages, these limitations may not apply to you.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="revisions">
              <AccordionTrigger className="text-xl font-semibold">5. Revisions and Errata</AccordionTrigger>
              <AccordionContent className="text-gray-300">
                The materials appearing on EXON ENTERPRISE LLC's Website may include technical, typographical, or photographic errors. EXON ENTERPRISE LLC will not promise that any of the materials in this Website are accurate, complete, or current. EXON ENTERPRISE LLC may change the materials contained on its Website at any time without notice. EXON ENTERPRISE LLC does not make any commitment to update the materials.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="links">
              <AccordionTrigger className="text-xl font-semibold">6. Links</AccordionTrigger>
              <AccordionContent className="text-gray-300">
                EXON ENTERPRISE LLC has not reviewed all of the sites linked to its Website and is not responsible for the contents of any such linked site. The presence of any link does not imply endorsement by EXON ENTERPRISE LLC of the site. The use of any linked website is at the user's own risk.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="modifications">
              <AccordionTrigger className="text-xl font-semibold">7. Site Terms of Use Modifications</AccordionTrigger>
              <AccordionContent className="text-gray-300">
                EXON ENTERPRISE LLC may revise these Terms of Use for its Website at any time without prior notice. By using this Website, you are agreeing to be bound by the current version of these Terms and Conditions of Use.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="privacy">
              <AccordionTrigger className="text-xl font-semibold">8. Your Privacy</AccordionTrigger>
              <AccordionContent className="text-gray-300">
                Please read our Privacy Policy.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="governing-law">
              <AccordionTrigger className="text-xl font-semibold">9. Governing Law</AccordionTrigger>
              <AccordionContent className="text-gray-300">
                Any claim related to EXON ENTERPRISE LLC's Website shall be governed by the laws of us without regards to its conflict of law provisions.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="order-acceptance">
              <AccordionTrigger className="text-xl font-semibold">10. Order Acceptance and Cancellation</AccordionTrigger>
              <AccordionContent className="text-gray-300">
                <p className="mb-4">EXON ENTERPRISE LLC, operating the Mandarin 3D website, reserves the right, at its sole discretion, to refuse or cancel any order for any reason. Situations that may result in your order being canceled include limitations on quantities available for purchase, inaccuracies or errors in product or pricing information, or problems identified by our credit and fraud avoidance department. We may also require additional verifications or information before accepting any order. We will contact you if all or any portion of your order is canceled or if additional information is required to accept your order.</p>
                <p>While EXON ENTERPRISE LLC strives to provide the best customer service and satisfaction, there are cases where orders cannot be processed as anticipated. In such instances, EXON ENTERPRISE LLC holds no obligation to fulfill the order and may choose to cancel it at its discretion. In the event of cancellation by EXON ENTERPRISE LLC, there is no guaranteed promise of a refund. If a payment has already been made, the decision to refund will be evaluated on a case-by-case basis, and EXON ENTERPRISE LLC reserves the right to withhold refunds at its discretion.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
    </div>
  );
}
