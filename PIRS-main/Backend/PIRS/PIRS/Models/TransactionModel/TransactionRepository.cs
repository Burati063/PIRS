using Microsoft.EntityFrameworkCore;
namespace PIRS.Models.TransactionModel
{
    public class TransactionRepository : ITransactionRepository
    {  
        private readonly PirsContext _context;
        public TransactionRepository(PirsContext context) { 
            _context= context;
        }
        public Transaction add(Transaction transaction)
        {
            _context.Transactions.Add(transaction);
            _context.SaveChanges();
            return transaction;
        }
        public List<Transaction> GetAll()
        {
            return _context.Transactions
                .Include(t => t.Report)
                .Include(t => t.Company)
                .Include(t => t.Contractor)
                .ToList();
        }

        public Transaction GetById(int id)
        {
            Transaction transaction = _context.Transactions
                .Include(t => t.Report)
                .Include(t => t.Company)
                .Include(t => t.Contractor)
                .FirstOrDefault(t => t.Id == id);
            return transaction;
        }
    }
}
