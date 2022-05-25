CREATE TRIGGER `BINSERT_AJUSTEESTOQUE` BEFORE INSERT ON `ajusteestoque` FOR EACH ROW
BEGIN 
	SET @database = (SELECT DATABASE());
    
        IF (NEW.MD5 IS NULL OR NEW.MD5 = '') THEN
            SET NEW.MD5 = UUID();
        END IF;

        IF (NEW.NUMNOTA IS NULL OR NEW.NUMNOTA = '') THEN
            SET NEW.NUMNOTA = (
                SELECT auto_increment
                FROM INFORMATION_SCHEMA.TABLES
                WHERE
                    table_name = 'AJUSTEESTOQUE' AND table_schema = @database
            );
        END IF;
END;