    import React, { useState, useEffect } from 'react';
    import m3d_logo from '../assets/images/m3d_logo.png';
    import { useAuth } from '../context/AuthContext';
    import { useCart } from '../context/Cart';
    import { ShoppingCart } from 'lucide-react';
    import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
    import { Badge } from '@/components/ui/badge';
    import { FaSignOutAlt, FaBars, FaTimes, FaShoppingCart, FaDownload, FaImages, FaHome } from "react-icons/fa";
    import { cn } from "@/lib/utils";

    import {
      NavigationMenu,
      NavigationMenuContent,
      NavigationMenuItem,
      NavigationMenuLink,
      NavigationMenuList,
      NavigationMenuTrigger,
      navigationMenuTriggerStyle,
    } from "@/components/ui/navigation-menu";

    const Header = () => {
        const { isAuthenticated, user } = useAuth();
        const { cart } = useCart();
        const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
        const [isLogoMenuOpen, setIsLogoMenuOpen] = useState(false);

        React.useEffect(() => {
            if (user && user.role) {
            }
        }, [user]);

        const toggleMobileMenu = () => {
            setIsMobileMenuOpen(!isMobileMenuOpen);
        };

        const handleLogoRightClick = (e) => {
            e.preventDefault();
            setIsLogoMenuOpen(!isLogoMenuOpen);
        };

        useEffect(() => {
            const handleClickOutside = (event) => {
                if (isLogoMenuOpen && !event.target.closest('.logo-menu-container')) {
                    setIsLogoMenuOpen(false);
                }
            };

            document.addEventListener('click', handleClickOutside);
            return () => {
                document.removeEventListener('click', handleClickOutside);
            };
        }, [isLogoMenuOpen]);

        return (
            <>
            {isAuthenticated && (
            <div className="flex items-center justify-end">
                <header className="px-4 sm:px-6 flex items-center justify-end mt-4 mr-2 sm:mr-3">
                    <div className="flex items-center">
                        <Badge variant="outline" className="mr-2 text-xs sm:text-sm">{user.username}</Badge>
                        <Badge className="mr-2 text-xs sm:text-sm">{user.role}</Badge>
                        <Avatar>
                            <AvatarImage src={user.profilePicture || "https://via.placeholder.com/40"} alt="Profile" />
                            <AvatarFallback>
                                {user.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </header>
            </div>
            )}
            <header className="p-4 flex items-center justify-between">
                <div className="flex items-center logo-menu-container">
                    <div className="relative" onContextMenu={handleLogoRightClick}>
                        <a href="/">
                            <div className="flex items-center">
                                <img src={m3d_logo} alt="logo" className="h-10 sm:h-14 w-auto  rounded-md mr-2" />
                                
                            </div>
                        </a>
                        {isLogoMenuOpen && (
                            <div className="absolute left-0 mt-2 w-48 sm:w-64 bg-[#2A2A2A] border border-[#5E5E5E] rounded-md shadow-lg z-10">
                                <button className="flex items-center w-full px-4 py-2 text-xs sm:text-sm text-white hover:bg-[#3A3A3A]" onClick={() => window.location.href = '/svg-logo'}>
                                    <FaDownload className="mr-2" />
                                    Download SVG Logo
                                </button>
                                <button className="flex items-center w-full px-4 py-2 text-xs sm:text-sm text-white hover:bg-[#3A3A3A]" onClick={() => window.location.href = '/svg-wordmark'}>
                                    <FaDownload className="mr-2" />
                                    Download SVG Wordmark
                                </button>
                                <button className="flex items-center w-full px-4 py-2 text-xs sm:text-sm text-white hover:bg-[#3A3A3A]" onClick={() => window.location.href = '/'}>
                                    <FaHome className="mr-2" />
                                    Go Home
                                </button>
                            </div>
                            
                        )}
                    </div>
                </div>
                <div className="md:hidden flex items-center">
                    {cart.cart_id && (
                        <a href="/cart" className="relative flex items-center justify-center">
                            <div className="card-special p-2 flex items-center">
                                <ShoppingCart className="text-white text-xl sm:text-2xl hover:text-gray-300 mr-1" />
                                {cart.files.length > 0 && (
                                    <p className="text-white text-xs sm:text-sm">{cart.files.length}</p>
                                )}
                            </div>
                        </a>
                    )}
                    
                </div>
                <div className={`md:flex ${isMobileMenuOpen ? 'block' : 'hidden'} absolute top-full left-0 right-0 bg-[#2A2A2A] z-20 md:relative md:bg-transparent`}>
                    <NavigationMenu orientation="vertical" className="w-full">
                        <NavigationMenuList className="flex flex-col md:flex-row">
                            <NavigationMenuItem>
                                <a href="/about" className={navigationMenuTriggerStyle()}>
                                    About Us
                                </a>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Model Library</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px]">
                                        <ListItem href="/models/featured" title="Featured Models" >
                                            Explore our curated collection of popular 3D models.
                                        </ListItem>
                                        <ListItem href="/models/categories" title="Categories">
                                            Browse models by category for easy navigation.
                                            
                                        </ListItem>
                                        <ListItem href="/models/custom" title="Custom Requests">
                                            Learn how to request custom 3D models tailored to your needs.
                                        </ListItem>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px]">
                                        <ListItem href="/products/business-plaques" title="Custom Business Plaques">
                                            Personalized plaques for your business needs.
                                        </ListItem>
                                        <ListItem href="/products/keychains" title="Custom Keychains">
                                            Unique keychains tailored to your design.
                                        </ListItem>
                                        <ListItem href="/products/cookie-cutters" title="Custom Cookie Cutters">
                                            Create your own shape for perfect cookies every time.
                                        </ListItem>
                                        <ListItem href="/products/nameplates" title="Custom Nameplates">
                                            Personalized nameplates for office or home use.
                                        </ListItem>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <a href="/contact" className={navigationMenuTriggerStyle()}>
                                    Contact Us
                                </a>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
                
                {cart.cart_id && (
                    <a href="/cart" className="relative hidden md:flex items-center justify-center pr-5 pt-2">
                        <ShoppingCart className="text-white text-2xl hover:text-gray-300 mr-2" />
                        {cart.files.length > 0 && (
                            <p className="text-white text-sm">{cart.files.length}</p>
                        )}
                    </a>
                )}
            </header>
            </>
        );
    };

    const ListItem = React.forwardRef(({ className, title, children, ...props }, ref) => {
      return (
        <li>
          <NavigationMenuLink asChild>
            <a
              ref={ref}
              className={cn(
                "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                className
              )}
              {...props}
            >
              <div className="text-sm font-medium leading-none">{title}</div>
              <p className="line-clamp-2 text-xs sm:text-sm leading-snug text-muted-foreground">
                {children}
              </p>
            </a>
          </NavigationMenuLink>
        </li>
      )
    });
    ListItem.displayName = "ListItem";

    export default Header;