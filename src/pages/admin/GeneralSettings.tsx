import { motion } from 'framer-motion';

const GeneralSettings = () => {
    return (
        <div className="space-y-8 max-w-4xl">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold">General Settings</h1>
                <p className="text-muted-foreground mt-1">
                    Site-wide configuration and SEO settings
                </p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-xl p-6"
            >
                <p className="text-muted-foreground">
                    SEO and metadata settings coming soon...
                </p>
            </motion.div>
        </div>
    );
};

export default GeneralSettings;
