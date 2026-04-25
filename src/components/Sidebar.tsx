import { docsData } from "@/components/docs/loader";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";

export const MobileSidebar = () => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden ">
          <Menu className="h-6 w-6" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[90vh] overflow-y-auto bg-background">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-8">NoteShala</h2>

          {docsData.map((category) => (
            <div key={category.id} className="mb-8">
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                <span>{category.icon}</span> {category.title}
              </h3>
              <ul className="space-y-3">
                {category.sections.map((section) => (
                  <li key={section.id}>
                    <DrawerClose asChild>
                      <Link
                        to={`/docs/${section.id}`}
                        className="block py-2 px-4 rounded-md hover:bg-muted transition-colors"
                      >
                        {section.title}
                      </Link>
                    </DrawerClose>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileSidebar;
